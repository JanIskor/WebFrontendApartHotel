import os

from rest_framework import serializers

from .models import *


class ApartmentsSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, apartment):
        if apartment.image:
            return apartment.image.url.replace("minio", os.getenv("IP_ADDRESS"), 1)

        return f"http://{os.getenv("IP_ADDRESS")}:9000/images/default.png"

    class Meta:
        model = Apartment
        fields = ("id", "name", "status", "price", "image")


class ApartmentSerializer(ApartmentsSerializer):
    class Meta:
        model = Apartment
        fields = "__all__"


class ApartmentAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = ("name", "description", "price", "image")


class ApplicationsSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    moderator = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Application
        fields = "__all__"


class ApplicationSerializer(ApplicationsSerializer):
    apartments = serializers.SerializerMethodField()

    def get_apartments(self, application):
        items = application.apartmentapplication_set.all()
        return [ApartmentItemSerializer(item.apartment, context={"wishes": item.wishes}).data for item in items]


class ApartmentItemSerializer(ApartmentSerializer):
    wishes = serializers.SerializerMethodField()

    def get_wishes(self, _):
        return self.context.get("wishes")

    class Meta:
        model = Apartment
        fields = ("id", "name", "status", "price", "image", "wishes")


class ApartmentApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentApplication
        fields = "__all__"

    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', "is_superuser")


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'username')
        write_only_fields = ('password',)
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data['username']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class UserProfileSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.CharField(required=False)
    password = serializers.CharField(required=False)
