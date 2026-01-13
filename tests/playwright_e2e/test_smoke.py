from playwright.sync_api import Page, expect

def test_smoke_overview(page: Page, frontend_url: str, api_load_timeout: int):
    # ARRANGE
    page.goto(frontend_url)

    # ACT & ASSERT
    expect(page.locator('text="Bistro Świetlica"')).to_be_visible(timeout=api_load_timeout)

def test_smoke_map(page: Page, frontend_url: str, safety_timeout: int, api_load_timeout: int):
    # ARRANGE
    page.goto(frontend_url)

    # ACT
    map_button = page.locator('button:has(svg.lucide.lucide-map)')
    map_button.wait_for(state="visible", timeout=safety_timeout)
    map_button.click()

    # ASSERT
    expect(page.locator('div[title="Bistro Świetlica"]')).to_be_visible(timeout=api_load_timeout)