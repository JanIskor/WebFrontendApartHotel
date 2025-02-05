import random
from datetime import datetime, timedelta
import uuid

from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from .permissions import *
from .redis import session_storage
from .serializers import *
from .utils import identity_user, get_session


def get_draft_application(request):
    user = identity_user(request)

    if user is None:
        return None

    application = Application.objects.filter(owner=user).filter(status=1).first()

    return application


@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'apartment_name',
            openapi.IN_QUERY,
            type=openapi.TYPE_STRING
        )
    ]
)
@api_view(["GET"])
def search_apartments(request):
    apartment_name = request.GET.get("apartment_name", "")

    apartments = Apartment.objects.filter(status=1)

    if apartment_name:
        apartments = apartments.filter(name__icontains=apartment_name)

    serializer = ApartmentsSerializer(apartments, many=True)

    draft_application = get_draft_application(request)

    resp = {
        "apartments": serializer.data,
        "apartments_count": ApartmentApplication.objects.filter(application=draft_application).count() if draft_application else None,
        "draft_application_id": draft_application.pk if draft_application else None
    }

    return Response(resp)


@api_view(["GET"])
def get_apartment_by_id(request, apartment_id):
    if not Apartment.objects.filter(pk=apartment_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    apartment = Apartment.objects.get(pk=apartment_id)
    serializer = ApartmentSerializer(apartment)

    return Response(serializer.data)


@swagger_auto_schema(method='put', request_body=ApartmentSerializer)
@api_view(["PUT"])
@permission_classes([IsModerator])
def update_apartment(request, apartment_id):
    if not Apartment.objects.filter(pk=apartment_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    apartment = Apartment.objects.get(pk=apartment_id)

    serializer = ApartmentSerializer(apartment, data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save()

    return Response(serializer.data)


@swagger_auto_schema(method='POST', request_body=ApartmentAddSerializer)
@api_view(["POST"])
@permission_classes([IsModerator])
@parser_classes((MultiPartParser,))
def create_apartment(request):
    serializer = ApartmentAddSerializer(data=request.data)

    serializer.is_valid(raise_exception=True)

    Apartment.objects.create(**serializer.validated_data)

    apartments = Apartment.objects.filter(status=1)
    serializer = ApartmentsSerializer(apartments, many=True)

    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsModerator])
def delete_apartment(request, apartment_id):
    if not Apartment.objects.filter(pk=apartment_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    apartment = Apartment.objects.get(pk=apartment_id)
    apartment.status = 2
    apartment.save()

    apartment = Apartment.objects.filter(status=1)
    serializer = ApartmentSerializer(apartment, many=True)

    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_apartment_to_application(request, apartment_id):
    if not Apartment.objects.filter(pk=apartment_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    apartment = Apartment.objects.get(pk=apartment_id)

    draft_application = get_draft_application(request)

    if draft_application is None:
        draft_application = Application.objects.create()
        draft_application.date_created = timezone.now()
        draft_application.owner = identity_user(request)
        draft_application.save()

    if ApartmentApplication.objects.filter(application=draft_application, apartment=apartment).exists():
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    item = ApartmentApplication.objects.create()
    item.application = draft_application
    item.apartment = apartment
    item.save()

    serializer = ApplicationSerializer(draft_application)
    return Response(serializer.data["apartments"])


@swagger_auto_schema(
    method='post',
    manual_parameters=[
        openapi.Parameter('image', openapi.IN_FORM, type=openapi.TYPE_FILE),
    ]
)
@api_view(["POST"])
@permission_classes([IsModerator])
@parser_classes((MultiPartParser,))
def update_apartment_image(request, apartment_id):
    if not Apartment.objects.filter(pk=apartment_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    apartment = Apartment.objects.get(pk=apartment_id)

    image = request.data.get("image")

    if image is None:
        return Response(status.HTTP_400_BAD_REQUEST)

    apartment.image = image
    apartment.save()

    serializer = ApartmentSerializer(apartment)

    return Response(serializer.data)


@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'status',
            openapi.IN_QUERY,
            type=openapi.TYPE_NUMBER
        ),
        openapi.Parameter(
            'date_formation_start',
            openapi.IN_QUERY,
            type=openapi.TYPE_STRING
        ),
        openapi.Parameter(
            'date_formation_end',
            openapi.IN_QUERY,
            type=openapi.TYPE_STRING
        )
    ]
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_applications(request):
    status_id = int(request.GET.get("status", 0))
    date_formation_start = request.GET.get("date_formation_start")
    date_formation_end = request.GET.get("date_formation_end")

    applications = Application.objects.exclude(status__in=[1, 5])

    user = identity_user(request)
    if not user.is_superuser:
        applications = applications.filter(owner=user)

    if status_id > 0:
        applications = applications.filter(status=status_id)

    if date_formation_start and parse_datetime(date_formation_start):
        applications = applications.filter(date_formation__gte=parse_datetime(date_formation_start) - timedelta(days=1))

    if date_formation_end and parse_datetime(date_formation_end):
        applications = applications.filter(date_formation__lt=parse_datetime(date_formation_end) + timedelta(days=1))

    serializer = ApplicationsSerializer(applications, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_application_by_id(request, application_id):
    user = identity_user(request)

    if not Application.objects.filter(pk=application_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    application = Application.objects.get(pk=application_id)

    if not user.is_superuser and application.owner != user:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ApplicationSerializer(application)

    return Response(serializer.data)


@swagger_auto_schema(method='put', request_body=ApplicationSerializer)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_application(request, application_id):
    user = identity_user(request)

    if not Application.objects.filter(pk=application_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    application = Application.objects.get(pk=application_id)
    serializer = ApplicationSerializer(application, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_status_user(request, application_id):
    user = identity_user(request)

    if not Application.objects.filter(pk=application_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    application = Application.objects.get(pk=application_id)

    if application.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    application.status = 2
    application.date_formation = timezone.now()
    application.save()

    serializer = ApplicationSerializer(application)

    return Response(serializer.data)


@swagger_auto_schema(
    method='put',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'status': openapi.Schema(type=openapi.TYPE_NUMBER),
        }
    )
)
@api_view(["PUT"])
@permission_classes([IsModerator])
def update_status_admin(request, application_id):
    if not Application.objects.filter(pk=application_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    request_status = int(request.data["status"])

    if request_status not in [3, 4]:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    application = Application.objects.get(pk=application_id)

    if application.status != 2:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    if request_status == 3:
        application.total_price = 1000 * random.randint(1, 30)

    application.status = request_status
    application.date_complete = timezone.now()
    application.moderator = identity_user(request)
    application.save()

    serializer = ApplicationSerializer(application)

    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_application(request, application_id):
    user = identity_user(request)

    if not Application.objects.filter(pk=application_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    application = Application.objects.get(pk=application_id)

    if application.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    application.status = 5
    application.save()

    return Response(status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_apartment_from_application(request, application_id, apartment_id):
    user = identity_user(request)

    if not Application.objects.filter(pk=application_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not ApartmentApplication.objects.filter(application_id=application_id, apartment_id=apartment_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = ApartmentApplication.objects.get(application_id=application_id, apartment_id=apartment_id)
    item.delete()

    application = Application.objects.get(pk=application_id)

    serializer = ApplicationSerializer(application)
    apartments = serializer.data["apartments"]

    return Response(apartments)


@swagger_auto_schema(method='PUT', request_body=ApartmentApplicationSerializer)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_apartment_in_application(request, application_id, apartment_id):
    user = identity_user(request)

    if not Application.objects.filter(pk=application_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not ApartmentApplication.objects.filter(apartment_id=apartment_id, application_id=application_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = ApartmentApplication.objects.get(apartment_id=apartment_id, application_id=application_id)

    serializer = ApartmentApplicationSerializer(item, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@swagger_auto_schema(method='post', request_body=UserLoginSerializer)
@api_view(["POST"])
def login(request):
    serializer = UserLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(**serializer.data)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    session_id = str(uuid.uuid4())
    session_storage.set(session_id, user.id)

    serializer = UserSerializer(user)
    response = Response(serializer.data, status=status.HTTP_200_OK)
    response.set_cookie("session_id", session_id, samesite="lax")

    return response


@swagger_auto_schema(method='post', request_body=UserRegisterSerializer)
@api_view(["POST"])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    user = serializer.save()

    session_id = str(uuid.uuid4())
    session_storage.set(session_id, user.id)

    serializer = UserSerializer(user)
    response = Response(serializer.data, status=status.HTTP_201_CREATED)
    response.set_cookie("session_id", session_id, samesite="lax")

    return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    session = get_session(request)
    session_storage.delete(session)

    response = Response(status=status.HTTP_200_OK)
    response.delete_cookie('session_id')

    return response


@swagger_auto_schema(method='PUT', request_body=UserProfileSerializer)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    if not User.objects.filter(pk=user_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = identity_user(request)

    if user.pk != user_id:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    serializer.save()

    password = request.data.get("password", None)
    if password is not None and not user.check_password(password):
        user.set_password(password)
        user.save()

    return Response(serializer.data, status=status.HTTP_200_OK)
