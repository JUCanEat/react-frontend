from playwright.sync_api import Page, expect


def test_unregistered_user(page: Page, frontend_url: str, safety_timeout: int, api_load_timeout: int):
    # ARRANGE
    page.goto(frontend_url)

    # ACT
    map_button = page.locator('button:has(svg.lucide.lucide-map)')
    map_button.wait_for(state="visible", timeout=safety_timeout)
    map_button.click()

    bistro_button = page.get_by_title('Bistro Świetlica')
    bistro_button.wait_for(state="visible", timeout=api_load_timeout)
    bistro_button.click()

    # Playwright has 'exact=false' by default
    goto_bistro_button = page.get_by_text("go to bistro świetlica")
    goto_bistro_button.wait_for(state="visible", timeout=safety_timeout)
    goto_bistro_button.click()

    # ASSERT (anti-pattern before ACT, but this is a long test)
    expect(page.get_by_text('potato dumplings')).to_be_visible(timeout=api_load_timeout)

    # ACT
    map_button = page.locator('button:has(svg.lucide.lucide-map)')
    map_button.wait_for(state="visible", timeout=safety_timeout)
    map_button.click()

    bistro_button = page.get_by_title('Bistro by Jelonek')
    bistro_button.wait_for(state="visible", timeout=api_load_timeout)
    bistro_button.click()

    goto_bistro_button = page.get_by_text("go to bistro by jelonek")
    goto_bistro_button.wait_for(state="visible", timeout=safety_timeout)
    goto_bistro_button.click()

    # ASSERT
    expect(page.get_by_text('chicken teriyaki bowl')).to_be_visible(timeout=api_load_timeout)