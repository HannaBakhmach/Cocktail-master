# -*- coding: utf-8 -*-
from django.contrib import admin
from django.db.models import *
from datetime import datetime


class Ingredient(Model):
    name = CharField("the name of the ingredient", max_length=25)

    # cocktail
    def __unicode__(self):
        return self.name

    def __str__(self):
        return u"{0}".format(self.name)


class Storage(Model):
    ingredient = OneToOneField(Ingredient)
    quantity = IntegerField("quantity of ingredient")

    @staticmethod
    def get_storage():
        storage = {}
        for item in Storage.objects.all():
            storage[item.ingredient.name] = item.quantity
        return storage

    @staticmethod
    def make_cocktail(cocktail):
        for item in Recipe.objects.filter(cocktail=cocktail):
            ingredient = Storage.objects.get(ingredient=item.ingredient)
            ingredient.quantity -= item.quantity
            ingredient.save()

    def __str__(self):
        # return "(Storage: %s %d)" % (self.ingredient, self.quantity)
        # return "{0} {1}".format(self.ingredient, self.quantity).decode('UTF-8')
        return u"{0} {1}".format(self.ingredient.name, self.quantity)

    def __unicode__(self):
        return self.ingredient.name

    class Meta:
        verbose_name_plural = "Storage"


class Cocktail(Model):
    name = CharField("the name of the cocktail", max_length=25)
    price = IntegerField("price of the cocktail")

    def __unicode__(self):
        return self.name

    def __str__(self):
        # return "(Cocktail: %s %duah)" % (self.name, self.price)
        return u"{0} {1}uah".format(self.name, self.price)


class Recipe(Model):
    ingredient = ForeignKey(Ingredient)
    cocktail = ForeignKey(Cocktail)
    quantity = IntegerField("quantity of ingredient")

    @staticmethod
    def get_ingredients(cocktail):
        recipe = {}
        for r in Recipe.objects.filter(cocktail=cocktail).all():
            recipe[r.ingredient.name] = r.quantity
        return recipe

    def __unicode__(self):
        return u"{0} {1}".format(self.cocktail.name, self.ingredient.name)

    def __str__(self):
        return u"{0} {1}".format(self.cocktail.name, self.ingredient.name)


class Order(Model):
    created = DateTimeField(default=datetime.now)
    cocktail = ForeignKey(Cocktail)

    def __unicode__(self):
        return self.cocktail.name

    def __str__(self):
        return u"{0} - {1}".format(self.cocktail.name, self.created)


admin.site.register(Cocktail)
admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(Storage)
admin.site.register(Order)
