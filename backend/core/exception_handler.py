import logging
import traceback

from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def full_exception_handler(exc, context):
    response = exception_handler(exc, context)

    view = context.get('view').__class__.__name__ if context.get('view') else 'unknown'
    request = context.get('request')
    path = request.path if request else 'unknown'

    if response is not None:
        return response

    logger.exception("Unhandled exception in %s (%s): %s", view, path, exc)
    return Response(
        {
            "detail": "Internal server error",
            "view": view,
            "path": path,
            "error_type": exc.__class__.__name__,
            "error": str(exc),
            "traceback": traceback.format_exc().splitlines()[-15:],
        },
        status=500,
    )
