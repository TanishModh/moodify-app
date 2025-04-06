from django.contrib import admin
from django.urls import path, include
from .swagger import urlpatterns as swagger_urls
from django.views.generic import RedirectView
from api import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('api/health/', health_check.health_check, name='health-check'),
    path('api/', include('api.urls')),
    path('', RedirectView.as_view(url='/swagger/', permanent=False)),  # Redirect base URL to Swagger UI URL
    *swagger_urls,
]
