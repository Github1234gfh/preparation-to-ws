# Generated by Django 4.2 on 2023-04-20 05:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_order_order_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_price',
            field=models.IntegerField(default=0),
        ),
    ]
