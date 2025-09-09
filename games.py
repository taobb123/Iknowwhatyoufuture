import json, asyncio
from pathlib import Path
from tqdm.asyncio import tqdm
from playwright.async_api import async_playwright

BASE = "https://www.crazygames.com"
TARGET = 50      # 想抓多少条
OUT = Path("crazygames_top50.json")

async def collect_links(page, limit):
    """滚动页面直到收集到足够的 /game/ 链接"""
    links = set()
    while len(links) < limit:
        # 抓取新出现的卡片
        for a in await page.query_selector_all('a[href^="/game/"]'):
            href = await a.get_attribute("href")
            if href:
                links.add(BASE + href.split("#", 1)[0])
        await page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
        await page.wait_for_timeout(1200)
    return list(links)[:limit]

async def scrape_game(playwright, url):
    """进入详情页抓取信息"""
    browser = playwright.chromium
    context = await browser.launch_persistent_context(user_data_dir="/tmp/playwright", headless=True)
    page = await context.new_page()
    try:
        await page.goto(url, timeout=60000)
        await page.wait_for_selector("h1", timeout=10000)
        name = await page.locator("h1").inner_text()
        desc = await page.locator('meta[name="description"]').get_attribute("content") or ""
        feats = []
        if await page.locator("h2:text-is('Features'), h2:has-text('Features')").count():
            items = page.locator("h2:text-is('Features') + ul li, h2:has-text('Features') + ul li")
            feats = [await items.nth(i).inner_text() for i in range(await items.count())]
        return {"url": url, "name": name.strip(), "description": desc.strip(), "features": feats}
    finally:
        await context.close()

async def main():
    async with async_playwright() as p:
        # 先滚动首页拿链接
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(BASE, timeout=60000)
        await page.wait_for_load_state("networkidle")
        links = await collect_links(page, TARGET)
        await page.close()
        await browser.close()

        # 再并发抓取详情
        tasks = [scrape_game(p, link) for link in links]
        data = [d for d in await tqdm.gather(*tasks) if d]

        OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f" 已保存 {len(data)} 条记录 -> {OUT.resolve()}")

if __name__ == "__main__":
    asyncio.run(main())
