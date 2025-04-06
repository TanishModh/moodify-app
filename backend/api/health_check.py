from django.http import JsonResponse

def health_check(request):
    """
    Simple health check endpoint that returns a status message.
    """
    return JsonResponse({
        'status': 'ok',
        'message': 'Moodify backend is running'
    })
