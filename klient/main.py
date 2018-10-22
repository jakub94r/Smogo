import aiohttp
import asyncio

async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    async with aiohttp.ClientSession() as session:
        json = await fetch(session, 'http://127.0.0.1:8080/getData')
        print(json)

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
