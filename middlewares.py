from aiohttp import web
from aiohttp.web import middleware
from aiohttp_session import get_session
from settings import *


@middleware
async def authorize(request, handler):
    def check_path(path):
        result = True
        for r in ['/login', '/static/', '/signin', '/signout', '/_debugtoolbar/']:
            if path.startswith(r):
                result = False
        return result

    session = await get_session(request)
    if session.get("user"):
        return await handler(request)
    elif check_path(request.path):
        url = request.app.router['login'].url()
        raise web.HTTPFound(url)
        return handler(request)
    else:
        return await handler(request)
