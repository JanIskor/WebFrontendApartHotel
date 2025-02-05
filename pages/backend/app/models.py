from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, User
from django.db import models


class Apartment(models.Model):
    STATUS_CHOICES = (
        (1, 'Действует'),
        (2, 'Удалена'),
    )

    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(max_length=500, verbose_name="Описание",)
    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name="Статус")
    image = models.ImageField(verbose_name="Фото", blank=True, null=True)

    price = models.IntegerField(verbose_name="Цена")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Апартамент"
        verbose_name_plural = "Апартаменты"
        db_table = "apartments"
        ordering = ('pk', )


class Application(models.Model):
    STATUS_CHOICES = (
        (1, 'Введён'),
        (2, 'В работе'),
        (3, 'Завершен'),
        (4, 'Отклонен'),
        (5, 'Удален')
    )

    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name="Статус")
    date_created = models.DateTimeField(verbose_name="Дата создания", blank=True, null=True)
    date_formation = models.DateTimeField(verbose_name="Дата формирования", blank=True, null=True)
    date_complete = models.DateTimeField(verbose_name="Дата завершения", blank=True, null=True)

    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="Создатель", related_name='owner', null=True)
    moderator = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="Сотрудник", related_name='moderator', blank=True,  null=True)

    start_date = models.DateField(verbose_name='Дата приезда', blank=True, null=True)
    final_date = models.DateField(verbose_name='Дата выезда', blank=True, null=True)
    total_price = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return "Заявление №" + str(self.pk)

    class Meta:
        verbose_name = "Заявление"
        verbose_name_plural = "Заявления"
        db_table = "applications"
        ordering = ('-date_formation', )


class ApartmentApplication(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.DO_NOTHING, blank=True, null=True)
    application = models.ForeignKey(Application, on_delete=models.DO_NOTHING, blank=True, null=True)
    wishes = models.TextField(default=0, verbose_name="Пожелания")

    def __str__(self):
        return "м-м №" + str(self.pk)

    class Meta:
        verbose_name = "м-м"
        verbose_name_plural = "м-м"
        db_table = "apartment_application"
        ordering = ('pk', )
        constraints = [
            models.UniqueConstraint(fields=['apartment', 'application'], name="apartment_application_constraint")
        ]
