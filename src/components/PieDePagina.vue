<template>
  <footer
    class="w-full py-10 relative bg-cover bg-center bg-no-repeat text-gray-200 selection:bg-teal-500 selection:text-white"
    style="background-image: url('https://i.ibb.co/z4bPJTy/servicio.jpg')"
    id="footer"
  >
    <div class="absolute inset-0 bg-gray-800 opacity-90"></div>
    <div
      class="container mx-auto px-2 py-4 lg:px-32 transition duration-300 ease-in-out relative z-10"
    >
      <div
        class="flex flex-col-reverse md:flex-row md:justify-between lg:justify-around gap-8 md:gap-4"
      >
        <div
          class="relative mt-14 md:mt-0 px-5 flex flex-col justify-center items-center text-gray-200 md:w-1/2 lg:w-auto"
        >
          <img
            src="/logoiglesia2.png"
            alt="Iglesia Bautista su Gracia es Mayor"
            class="h-24 object-contain mt-auto"
          />
          <blockquote class="text-center">
            "Porque por gracia sois salvos por medio de la fe; y esto no de
            vosotros, pues es don de Dios; <br />
            no por obras, para que nadie se gloríe.<br />
            Efesios 2:8-9
          </blockquote>

          <div class="w-full h-px bg-gray-600 my-6"></div>

          <div class="mt-auto flex flex-col items-center">
            <span
              class="inline-flex mt-6 w-full justify-center md:justify-start md:w-auto"
            >
              <a
                href="https://www.facebook.com/profile.php?id=100093713355114"
                class="text-gray-200 hover:text-teal-400 transition duration-300"
              >
                <span class="sr-only">Facebook</span>
                <svg
                  fill="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                  ></path>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UCZYAQXzmnW0fxiNYWglTnBw"
                class="ml-3 text-gray-200 hover:text-teal-400 transition duration-300"
              >
                <span class="sr-only">YouTube</span>
                <svg
                  fill="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21.2,7.7c-0.3-1.1-0.9-2-1.7-2.8C18.7,4.6,16.7,4,12,4S5.3,4.6,3.5,4.9C2.7,5.7,2.1,6.6,1.8,7.7C1.5,8.9,1.5,10.4,1.5,12s0,3.1,0.3,4.3c0.3,1.1,0.9,2,1.7,2.8C5.3,19.4,7.3,20,12,20s6.7-0.6,8.5-0.9c0.8-0.7,1.4-1.7,1.7-2.8c0.3-1.1,0.3-2.6,0.3-4.3s0-3.1-0.3-4.3zM9.8,15.3V8.7l5.6,3.3L9.8,15.3z"
                  ></path>
                </svg>
              </a>
            </span>
            <span class="py-4 text-xs"
              >&copy;2023, Todos los derechos reservados.</span
            >
          </div>
          <span
            class="sm:hidden absolute -top-4 left-1/2 w-1/4 h-px bg-gray-400 transform -translate-x-1/2"
            aria-hidden="true"
          />
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-gray-400 md:w-1/2 lg:w-auto"
        >
          <div
            class="col-span-1 pb-0 md:py-3 px-4 flex flex-col items-center sm:items-start"
          >
            <h3
              class="py-1.5 md:py-4 text-xl text-white font-bold tracking-wide flex items-center"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
              Navegación
            </h3>
            <div class="w-full h-px bg-gray-600 mb-4"></div>
            <nav
              class="flex flex-col sm:flex-row md:flex-col font-medium list-none gap-3 sm:gap-4 md:gap-2 items-center sm:items-start"
            >
              <ul
                class="flex flex-col sm:flex-row md:flex-col gap-3 sm:gap-4 md:gap-2 items-center sm:items-start"
              >
                <li>
                  <a href="#inicio" class="hover:text-gray-200">Inicio</a>
                </li>
                <li>
                  <a href="#pastor" class="hover:text-gray-200">Pastor</a>
                </li>
                <li>
                  <a href="#servicio" class="hover:text-gray-200">Servicios</a>
                </li>
                <li>
                  <a href="#ministerios" class="hover:text-gray-200"
                    >Ministerios</a
                  >
                </li>
                <li>
                  <a href="#anuncios" class="hover:text-gray-200"
                    >Anuncios y Eventos</a
                  >
                </li>
                <li>
                  <a
                    href="confesion.html"
                    class="hover:text-gray-200 hidden lg:block"
                    >Confesion de fe</a
                  >
                </li>
                <li>
                  <a
                    href="preguntas.html"
                    class="hover:text-gray-200 hidden lg:block"
                    >Preguntas frecuentes</a
                  >
                </li>
              </ul>
            </nav>
          </div>

          <div
            class="col-span-1 pb-0 md:py-3 px-4 flex flex-col items-center sm:items-start"
          >
            <h3
              class="py-1.5 md:py-4 text-xl text-white font-bold tracking-wide flex items-center"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Información
            </h3>
            <div class="w-full h-px bg-gray-600 mb-4"></div>
            <ol class="flex flex-col gap-2">
              <li>
                Calle 70 Bis Sur #80-56 <br />
                Salon comunal Asovivir, <br />
                Bosa, Bogota
              </li>
              <br />
              <li>Servicios de Adoración: <br />Domingos 10:00 hs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script></script>
