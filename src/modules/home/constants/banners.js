import homeBannerScene from '@/assets/images/banners/home-banner-scene.avif'

/**
 * Баннеры главной страницы.
 * href — опциональная ссылка (внутренняя или внешняя); null = без перехода.
 */
export const HOME_BANNERS = [
  {
    id: 'slogan',
    slogan: 'Учись! Веселись! Расти!',
    sloganLines: ['Учись!', 'Веселись!', 'Расти!'],
    image: homeBannerScene,
    href: null,
    ariaLabel: 'Учись! Веселись! Расти!',
  },
]
