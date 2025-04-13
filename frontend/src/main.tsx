import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './query-client';
import Router from './router.tsx';

import { ThemeProvider } from "@/components/theme-provider";
import i18next from "@/locale";
import { I18nextProvider } from "react-i18next";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { Toaster } from './components/ui/sonner.tsx';




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18next} defaultNS={'translation'}>
      <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <Router />
          </QueryClientProvider>,
        </TooltipProvider>
        <Toaster />
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>
)
