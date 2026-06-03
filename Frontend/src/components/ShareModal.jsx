'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ShareIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
  TwitterShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton
} from 'react-share'
import { TwitterIcon, FacebookIcon, WhatsappIcon, EmailIcon } from 'react-share'

export default function ShareModal({ open, setOpen, videoUrl, videoTitle }) {
  const shareOptions = [
    { 
      name: 'Twitter', 
      component: TwitterShareButton,
      icon: TwitterIcon,
      color: '#000000'
    },
    { 
      name: 'Facebook', 
      component: FacebookShareButton,
      icon: FacebookIcon,
      color: '#1877F2'
    },
    { 
      name: 'WhatsApp', 
      component: WhatsappShareButton,
      icon: WhatsappIcon,
      color: '#25D366'
    },
    { 
      name: 'Email', 
      component: EmailShareButton,
      icon: EmailIcon,
      color: '#EA4335'
    },
  ];

  const handleCopyLink = () => {
    const url = videoUrl || (typeof window !== 'undefined' ? window.location.href : '');
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-[#1a1a1a] text-left shadow-2xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:w-full sm:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <DialogTitle as="h3" className="text-lg font-semibold text-white flex items-center gap-2">
                <ShareIcon className="w-5 h-5 text-purple-400" />
                Share Video
              </DialogTitle>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-300 mb-2">Share this video:</p>
                <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                  <p className="text-white text-sm font-medium truncate">{videoTitle || 'Untitled Video'}</p>
                </div>
              </div>

             
              <div className="grid grid-cols-2 gap-3 mb-6">
                {shareOptions.map((option) => {
                  const ShareButton = option.component;
                  const Icon = option.icon;
                  const url = videoUrl || (typeof window !== 'undefined' ? window.location.href : '');
                  
                  return (
                    <ShareButton
                      key={option.name}
                      url={url}
                      title={videoTitle || 'Check out this video'}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <Icon size={32} round />
                      <span className="text-sm text-gray-300">{option.name}</span>
                    </ShareButton>
                  );
                })}
              </div>

              
              <div className="mb-6">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 transition-all"
                >
                  <span className="text-lg">🔗</span>
                  <span className="text-sm text-purple-300 font-medium">Copy Link</span>
                </button>
              </div>

             
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Video URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={videoUrl || (typeof window !== 'undefined' ? window.location.href : '')}
                    readOnly
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}