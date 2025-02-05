from django.urls import path
from .views import *

urlpatterns = [
    # Набор методов для услуг
    path('api/apartments/', search_apartments),  # GET
    path('api/apartments/<int:apartment_id>/', get_apartment_by_id),  # GET
    path('api/apartments/<int:apartment_id>/update/', update_apartment),  # PUT
    path('api/apartments/<int:apartment_id>/update_image/', update_apartment_image),  # POST
    path('api/apartments/<int:apartment_id>/delete/', delete_apartment),  # DELETE
    path('api/apartments/create/', create_apartment),  # POST
    path('api/apartments/<int:apartment_id>/add_to_application/', add_apartment_to_application),  # POST

    # Набор методов для заявок
    path('api/applications/', search_applications),  # GET
    path('api/applications/<int:application_id>/', get_application_by_id),  # GET
    path('api/applications/<int:application_id>/update/', update_application),  # PUT
    path('api/applications/<int:application_id>/update_status_user/', update_status_user),  # PUT
    path('api/applications/<int:application_id>/update_status_admin/', update_status_admin),  # PUT
    path('api/applications/<int:application_id>/delete/', delete_application),  # DELETE

    # Набор методов для м-м
    path('api/applications/<int:application_id>/update_apartment/<int:apartment_id>/', update_apartment_in_application),  # PUT
    path('api/applications/<int:application_id>/delete_apartment/<int:apartment_id>/', delete_apartment_from_application),  # DELETE

    # Набор методов для аутентификации и авторизации
    path("api/users/register/", register),  # POST
    path("api/users/login/", login),  # POST
    path("api/users/logout/", logout),  # POST
    path("api/users/<int:user_id>/update/", update_user)  # PUT
]
