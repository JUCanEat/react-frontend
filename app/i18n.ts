import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const LANGUAGE_STORAGE_KEY = 'jucaneat-language';

const resources = {
  en: {
    translation: {
      topBar: {
        login: 'Login',
        logout: 'Logout',
        languageLabel: 'Language',
      },
      common: {
        loading: 'Loading...',
        error: 'Error',
        goBack: 'Go Back',
        cancel: 'Cancel',
      },
      nav: {
        home: 'Home',
        map: 'Map',
        profile: 'Profile',
      },
      overview: {
        restaurants: 'Restaurants',
        vendingMachines: 'Vending Machines',
        search: 'Search',
        loadingRestaurantsError: 'Oops, something went wrong while loading restaurants.',
        loadingVendingMachinesError: 'Oops, something went wrong while loading vending machines.',
      },
      filters: {
        vegan: 'Vegan',
        vegetarian: 'Vegetarian',
        lactoseFree: 'Lactose-free',
        glutenFree: 'Gluten-free',
        toggleVegan: 'Toggle vegan',
        toggleVegetarian: 'Toggle vegetarian',
        toggleLactoseFree: 'Toggle lactose free',
        toggleGlutenFree: 'Toggle gluten free',
      },
      menu: {
        loadingMenu: 'Loading menu...',
        errorLoadingMenu: 'Error loading menu:',
        noDishes: 'No dishes available for this restaurant',
        restaurantId: 'Restaurant ID: {{id}}',
      },
      profile: {
        loadingProfile: 'Loading profile…',
        notLoggedIn: 'You are not logged in',
        failedToLoadProfile: 'Failed to load profile',
        yourRestaurants: 'Your restaurants',
        noRestaurantsYet: "You don't have any restaurants yet.",
        addMenuFromPhoto: 'Add menu from photo',
        addManually: 'Add manually',
      },
      auth: {
        loading: 'Loading...',
        redirectingToLogin: 'Redirecting to login...',
        accessDenied: 'Access denied',
        restaurantIdMissing: 'Restaurant ID is missing',
      },
      menuForm: {
        loadingAuthentication: 'Loading authentication...',
        authenticationRequired: 'Authentication required',
        pleaseLoginToAddMenu: 'Please log in to add a menu.',
        noRestaurantSpecified:
          'No restaurant specified. Please try again from your restaurant page.',
        createDailyMenu: 'Create Daily Menu',
        date: 'Date',
        dish: 'Dish {{index}}',
        name: 'Name',
        category: 'Category',
        selectCategory: 'Select category',
        price: 'Price',
        allergens: 'Allergens',
        addDish: 'Add Dish',
        submitMenu: 'Submit Menu',
        submitting: 'Submitting...',
        validationSelectDate: 'Please select a date.',
        validationAddDish: 'Please add at least one dish.',
        validationNameRequired: 'Dish {{index}}: Name is required.',
        validationCategoryRequired: 'Dish {{index}}: Category is required.',
        validationPriceRequired: 'Dish {{index}}: Price must be greater than 0.',
        failedToUpdateMenu: 'Failed to update menu.',
        categorySoup: 'Soup',
        categoryMainCourse: 'Main course',
      },
      map: {
        vendingMachine: 'Vending machine',
        navigate: 'Navigate',
        goTo: 'Go to {{name}}',
        loading: 'Loading...',
        errorLoadingRestaurants: 'Error loading restaurants',
        noRestaurantsFound: 'No restaurants found',
        errorLoadingVendingMachines: 'Error loading vending machines',
        noVendingMachinesFound: 'No vending machines found',
      },
      login: {
        logIn: 'Log in',
      },
      errors: {
        oops: 'Oops!',
        unexpected: 'An unexpected error occurred.',
        notFound: 'The requested page could not be found.',
      },
      staff: {
        uploadingImage: 'Uploading image...',
        processingWithAi: 'Processing menu with AI...',
        thisMayTakeMoments: 'This may take a few moments',
        uploadFile: 'Upload File',
        changeManually: 'Change Manually',
        noDraftFound: 'No draft found',
        loadingDraft: 'Loading draft...',
        approvingMenu: 'Approving menu...',
        reviewMenuDraft: 'Review Menu Draft',
        approveActivateMenu: 'Approve & Activate Menu',
        approving: 'Approving...',
        remove: 'Remove',
        pricePln: 'Price (PLN)',
        backToProfile: 'Back to Profile',
        notLoggedIn: 'You are not logged in',
        uploadFailed: 'Upload failed: {{error}}',
        failedToLoadDraft: 'Failed to load menu draft',
        failedToApproveMenu: 'Failed to approve menu. Please try again.',
        categoryBreakfast: 'Breakfast',
        categoryBurger: 'Burger',
        categoryMain: 'Main Courses',
        categorySoups: 'Soups',
        categoryPizza: 'Pizza',
        categorySnack: 'Snack',
        categoryDesserts: 'Desserts',
        categoryDrinks: 'Drinks',
      },
    },
  },
  pl: {
    translation: {
      topBar: {
        login: 'Zaloguj',
        logout: 'Wyloguj',
        languageLabel: 'Język',
      },
      common: {
        loading: 'Ładowanie...',
        error: 'Błąd',
        goBack: 'Wróć',
        cancel: 'Anuluj',
      },
      nav: {
        home: 'Strona główna',
        map: 'Mapa',
        profile: 'Profil',
      },
      overview: {
        restaurants: 'Restauracje',
        vendingMachines: 'Automaty',
        search: 'Szukaj',
        loadingRestaurantsError: 'Ups, coś poszło nie tak podczas ładowania restauracji.',
        loadingVendingMachinesError: 'Ups, coś poszło nie tak podczas ładowania automatów.',
      },
      filters: {
        vegan: 'Wegańskie',
        vegetarian: 'Wegetariańskie',
        lactoseFree: 'Bez laktozy',
        glutenFree: 'Bez glutenu',
        toggleVegan: 'Przełącz filtr wegański',
        toggleVegetarian: 'Przełącz filtr wegetariański',
        toggleLactoseFree: 'Przełącz filtr bez laktozy',
        toggleGlutenFree: 'Przełącz filtr bezglutenowy',
      },
      menu: {
        loadingMenu: 'Ładowanie menu...',
        errorLoadingMenu: 'Błąd podczas ładowania menu:',
        noDishes: 'Brak dań dla tej restauracji',
        restaurantId: 'ID restauracji: {{id}}',
      },
      profile: {
        loadingProfile: 'Ładowanie profilu…',
        notLoggedIn: 'Nie jesteś zalogowany/a',
        failedToLoadProfile: 'Nie udało się załadować profilu',
        yourRestaurants: 'Twoje restauracje',
        noRestaurantsYet: 'Nie masz jeszcze żadnych restauracji.',
        addMenuFromPhoto: 'Dodaj menu ze zdjęcia',
        addManually: 'Dodaj ręcznie',
      },
      auth: {
        loading: 'Ładowanie...',
        redirectingToLogin: 'Przekierowanie do logowania...',
        accessDenied: 'Brak dostępu',
        restaurantIdMissing: 'Brakuje ID restauracji',
      },
      menuForm: {
        loadingAuthentication: 'Ładowanie uwierzytelniania...',
        authenticationRequired: 'Wymagane uwierzytelnienie',
        pleaseLoginToAddMenu: 'Zaloguj się, aby dodać menu.',
        noRestaurantSpecified:
          'Nie wskazano restauracji. Spróbuj ponownie z poziomu strony restauracji.',
        createDailyMenu: 'Utwórz dzienne menu',
        date: 'Data',
        dish: 'Danie {{index}}',
        name: 'Nazwa',
        category: 'Kategoria',
        selectCategory: 'Wybierz kategorię',
        price: 'Cena',
        allergens: 'Alergeny',
        addDish: 'Dodaj danie',
        submitMenu: 'Zapisz menu',
        submitting: 'Zapisywanie...',
        validationSelectDate: 'Wybierz datę.',
        validationAddDish: 'Dodaj co najmniej jedno danie.',
        validationNameRequired: 'Danie {{index}}: nazwa jest wymagana.',
        validationCategoryRequired: 'Danie {{index}}: kategoria jest wymagana.',
        validationPriceRequired: 'Danie {{index}}: cena musi być większa niż 0.',
        failedToUpdateMenu: 'Nie udało się zaktualizować menu.',
        categorySoup: 'Zupa',
        categoryMainCourse: 'Danie główne',
      },
      map: {
        vendingMachine: 'Automat',
        navigate: 'Nawiguj',
        goTo: 'Przejdź do {{name}}',
        loading: 'Ładowanie...',
        errorLoadingRestaurants: 'Błąd podczas ładowania restauracji',
        noRestaurantsFound: 'Nie znaleziono restauracji',
        errorLoadingVendingMachines: 'Błąd podczas ładowania automatów',
        noVendingMachinesFound: 'Nie znaleziono automatów',
      },
      login: {
        logIn: 'Zaloguj się',
      },
      errors: {
        oops: 'Ups!',
        unexpected: 'Wystąpił nieoczekiwany błąd.',
        notFound: 'Nie znaleziono żądanej strony.',
      },
      staff: {
        uploadingImage: 'Przesyłanie zdjęcia...',
        processingWithAi: 'Przetwarzanie menu przez AI...',
        thisMayTakeMoments: 'To może chwilę potrwać',
        uploadFile: 'Prześlij plik',
        changeManually: 'Zmień ręcznie',
        noDraftFound: 'Nie znaleziono wersji roboczej',
        loadingDraft: 'Ładowanie wersji roboczej...',
        approvingMenu: 'Zatwierdzanie menu...',
        reviewMenuDraft: 'Przejrzyj wersję roboczą menu',
        approveActivateMenu: 'Zatwierdź i aktywuj menu',
        approving: 'Zatwierdzanie...',
        remove: 'Usuń',
        pricePln: 'Cena (PLN)',
        backToProfile: 'Wróć do profilu',
        notLoggedIn: 'Nie jesteś zalogowany/a',
        uploadFailed: 'Nie udało się przesłać: {{error}}',
        failedToLoadDraft: 'Nie udało się załadować wersji roboczej menu',
        failedToApproveMenu: 'Nie udało się zatwierdzić menu. Spróbuj ponownie.',
        categoryBreakfast: 'Śniadania',
        categoryBurger: 'Burgery',
        categoryMain: 'Dania główne',
        categorySoups: 'Zupy',
        categoryPizza: 'Pizza',
        categorySnack: 'Przekąski',
        categoryDesserts: 'Desery',
        categoryDrinks: 'Napoje',
      },
    },
  },
} as const;

type SupportedLanguage = keyof typeof resources;

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage === 'en' || savedLanguage === 'pl') {
    return savedLanguage;
  }

  const browserLanguage = window.navigator.language.split('-')[0];
  return browserLanguage === 'pl' ? 'pl' : 'en';
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

  if (typeof window !== 'undefined') {
    i18n.on('languageChanged', language => {
      if (language === 'en' || language === 'pl') {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      }
    });
  }
}

export default i18n;
