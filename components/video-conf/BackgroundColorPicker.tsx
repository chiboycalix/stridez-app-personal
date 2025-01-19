import { useVideoConferencing } from '@/context/VideoConferencingContext';
import { AnimatePresence, motion } from 'framer-motion'
import React, { Fragment, useEffect, useState } from 'react'
import ColorPicker from 'react-pick-color';
import { Button } from '../ui/button';
import { BackgroundOne, BackgroundTwo } from '@/public/assets';
import Image from 'next/image';

const backgroundImages = [
  {
    id: 1,
    src: ""
  },
  {
    id: 2,
    src: BackgroundOne
  },
  {
    id: 3,
    src: BackgroundTwo
  }
]

const BackgroundColorPicker = ({ isOpen, onClose, colorPickeranchorRect, color, setColor }: any) => {
  if (!colorPickeranchorRect) return null;

  const { setBackgroundColor, setBackgroundBlurring, setBackgroundImage } = useVideoConferencing();
  const [blurValue, setBlurValue] = useState(0)
  const [imgSrc, setImgSrc] = useState(undefined)
  const menuPosition = {
    bottom: window.innerHeight - colorPickeranchorRect.top + 40,
    right: window.innerWidth - colorPickeranchorRect.right + 20,
  };

  useEffect(() => {
    setBackgroundColor(color)
  }, [color])

  const handleSetBlurValue = (e: any) => {
    setBlurValue(Number(e.target.value))
  }

  const handleSetImgSrc = (src: any) => {
    setImgSrc(src?.src)
  }

  const handleSetImgSrcNone = () => {
    handleSetImgSrc(null)
    setBlurValue(0)
  }
  useEffect(() => {
    setBackgroundBlurring(blurValue)
  }, [blurValue])

  useEffect(() => {
    setBackgroundImage(imgSrc)
  }, [imgSrc])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              bottom: menuPosition.bottom,
              right: menuPosition.right,
              transformOrigin: 'bottom right'
            }}
            className="z-50 bg-[#1A1C1D] rounded-lg shadow-lg p-4"
          >
            <div className='w-full'>
              <ColorPicker color={color} onChange={color => setColor(color.hex)} className='w-full' />
            </div>
            <div className='flex my-2'>
              <Button onClick={() => setColor("transparent")}>None</Button>
            </div>

            <div className="py-2">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-200">Blur</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                value={blurValue}
                onChange={handleSetBlurValue}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            <div className='grid grid-cols-4 border border-gray-800 p-2'>
              {
                backgroundImages.map((backgroundImage) => {
                  return <Fragment key={backgroundImage.id}>
                    {backgroundImage.src === "" ?
                      <div
                        className='w-12 h-12 bg-black cursor-pointer text-white flex items-center justify-center text-sm'
                        onClick={handleSetImgSrcNone}
                      >None</div>
                      :
                      <Image
                        src={backgroundImage.src}
                        alt="background image"
                        width={48}
                        height={40}
                        className='h-12 cursor-pointer'
                        onClick={() => handleSetImgSrc(backgroundImage.src)}
                      />}
                  </Fragment>
                })
              }
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BackgroundColorPicker