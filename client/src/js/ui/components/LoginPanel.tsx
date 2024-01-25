import { Auth } from '@supabase/auth-ui-react';
import { SocialLayout, ThemeSupa, ViewType } from '@supabase/auth-ui-shared';
import { supabase } from '../../systems/initSupabase';
import { Fragment, useState } from 'react';
import {user as useUser} from '../../systems/User';
import { Dialog, Transition } from '@headlessui/react'

const views: { id: ViewType; title: string }[] = [
  { id: 'sign_in', title: 'Sign In' },
  { id: 'sign_up', title: 'Sign Up' },
  { id: 'magic_link', title: 'Magic Link' },
  { id: 'forgotten_password', title: 'Forgotten Password' },
  { id: 'update_password', title: 'Update Password' },
]

const colors = [
  'rgb(202, 37, 37)',
  'rgb(65, 163, 35)',
  'rgb(8, 107, 177)',
  'rgb(235, 115, 29)',
] 

const socialAlignments = ['horizontal', 'vertical'] as const
const radii = ['5px', '10px', '20px'];

export const LoginPanel = ({signinOpen=false, closer}: any) => {
  
  const user = useUser();
  // const [open, setOpen] = useState(false)


  const [socialLayout, setSocialLayout] = useState<SocialLayout>(socialAlignments[1])

  const [brandColor, setBrandColor] = useState(colors[0])
  const [view, setView] = useState(views[0])
  const [borderRadius, setBorderRadius] = useState(radii[0])
  const [theme, setTheme] = useState('dark')
  // const domain = "https://nxmiylornwbtvvdfgvsz.supabase.co"; //import.meta.env.VITE_PUBLIC_DOMAIN;
  // console
  // console.log("USER, domain", user, domain);
  console.log("signinOpen", signinOpen, window.location.origin);

  return (
    <Transition.Root show={signinOpen} as={Fragment}>
      {/**@ts-ignore */}
      <Dialog as="div" className="relative z-10" onClose={() => {closer()}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>


          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-zinc-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
              <div className="dark:bg-scale-200 bg-scale-100 relative py-2 text-3xl">
                  <div className="relative col-span-12 mb-16 md:col-span-7 md:mb-0 lg:col-span-6">
                    <div className="relative lg:mx-auto lg:max-w-md bg-zinc-800">
                      <div className="">
                        <div className="border-scale-400 bg-scale-300 relative rounded-xl px-8 py-12 drop-shadow-sm">
                          <div className="mb-6 flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                              <h1 className="text-scale-1200 text-2xl text-white">
                                Tripwright
                              </h1>
                            </div>
                            <p className="text-scale-1100 text-auth-widget-test">
                              Sign in today to save your trips
                            </p>
                          </div>
                          <Auth
                            supabaseClient={supabase}
                            view={view.id}
                            redirectTo={window.location.origin}
                            appearance={{
                              theme: ThemeSupa,
                              style: {
                                button: {
                                  borderRadius: borderRadius,
                                  borderColor: 'rgba(0,0,0,0)',
                                },
                              },
                              variables: {
                                default: {
                                  colors: {
                                    brand: brandColor,
                                    brandAccent: `gray`,
                                  },
                                },
                              },
                            }}
                            providers={['google']}
                            socialLayout={socialLayout}
                            theme={theme}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>

      </Dialog>
    </Transition.Root>
  )
};
