import codecs
import csv

from django import forms
from django.http import HttpResponse, Http404
from django.shortcuts import render
from django_ajax.decorators import ajax

from .models import Cocktail, Recipe, Storage, Order


class FileUploadForm(forms.Form):
    file_source = forms.FileField()


@ajax
def cocktails(request):
    response = {}
    for c in Cocktail.objects.all():
        response[c.name] = {'id': c.id, 'price': c.price, 'recipe': Recipe.get_ingredients(c)}
    return response


@ajax
def storage(request):
    return Storage.get_storage()


@ajax
def order(request):
    if not request.POST:
        raise Http404
    cocktail = Cocktail.objects.get(id=request.POST['id'])
    o = Order()
    o.cocktail = cocktail
    o.save()
    Storage.make_cocktail(cocktail)
    return HttpResponse('')

def encode(s, name, *args, **kwargs):
    codec = codecs.lookup(name)
    rv, length = codec.encode(s, *args, **kwargs)
    if not isinstance(rv, (str, bytes, bytearray)):
        raise TypeError('Not a string or byte codec')
    return rv


@ajax
def upload(request):
    if request.method == 'POST':
        form = FileUploadForm(data=request.POST, files=request.FILES)
        if form.is_valid():
            bytes = form.cleaned_data['file_source'].read().decode("utf-8")
            lines = "".join(map(chr, bytes))
            print(lines)
            for line in lines.split('\n'):
                print(line)
            return {'lines': lines}
            # for line in form.cleaned_data['file_source'].read():
            #     print(line)
        else:
            print('invalid form')
            return {'status': 'error', 'errors': form.errors}


def index(request):
    form = FileUploadForm()
    return render(request, 'index.html', {'form': form})
