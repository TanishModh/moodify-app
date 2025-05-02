from django.urls import path
from .views import text_emotion, facial_emotion, music_recommendation, recommendations, test_tmdb_api

urlpatterns = [
    path('text_emotion/', text_emotion, name='text_emotion'),
    path('facial_emotion/', facial_emotion, name='facial_emotion'),
    path('music_recommendation/', music_recommendation, name='music_recommendation'),
    path('recommendations/', recommendations, name='recommendations'),
    path('test_tmdb_api/', test_tmdb_api, name='test_tmdb_api'),
]
