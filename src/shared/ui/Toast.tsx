'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * 화면에 알림을 표시하는 Toast 컴포넌트
 * 위치(position)를 'top' 또는 'bottom'으로 지정할 수 있습니다.
 *
 * @example
 * ```tsx
 * <Toast
 *   title="You can upload up to 10 assets"
 *   description="Delete one to upload a new asset."
 *   icon={<AlertIcon className="size-6" />}
 *   isVisible={showToast}
 *   onClose={() => setShowToast(false)}
 *   position="bottom" // 또는 "top"
 * />
 * ```
 *
 * @property {string} title - Toast의 제목
 * @property {string} description - Toast의 부제목 또는 설명
 * @property {ReactNode} [icon] - Toast에 표시될 아이콘 컴포넌트
 * @property {boolean} isVisible - Toast의 표시 여부
 * @property {() => void} onClose - Toast가 닫힐 때 호출될 함수
 * @property {'top' | 'bottom'} [position=bottom] - Toast의 수직 위치 ('top' 또는 'bottom')
 * @property {number} [offset=32] - 위치 값(px 단위)
 * @property {number} [autoCloseTime=2500] - Toast가 자동으로 닫히는 시간 (ms)
 * @property {number} [zIndex=99999] - z-index 값
 */

export interface ToastProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  isVisible: boolean;
  onClose: () => void;
  position?: 'top' | 'bottom';
  offset?: number;
  autoCloseTime?: number;
  zIndex?: number;
}

export const Toast = ({
  title,
  description,
  icon,
  isVisible,
  onClose,
  position = 'top',
  offset = 32,
  autoCloseTime = 2500,
  zIndex = 99999,
}: ToastProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 자동 닫기 타이머 설정
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoCloseTime]);

  // 애니메이션 초기 방향과 종료 방향 계산 (위치에 따라 다름)
  const initialY = position === 'top' ? -100 : 100;
  const animateY = 0;
  const exitY = position === 'top' ? -100 : 100;

  // SSR 또는 마운트 전에는 렌더링 안함
  if (!isMounted) return null;

  // wrapper 스타일 - 화면의 전체 중앙에 고정
  const wrapperStyle: React.CSSProperties = {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    [position]: `${offset}px`,
    zIndex,
    display: 'flex',
    justifyContent: 'center',
    width: 'fit-content',
    margin: '0 auto',
    pointerEvents: 'auto',
  };

  // Toast 컨텐츠
  const toastContent = (
    <div style={wrapperStyle}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: initialY, opacity: 0 }}
            animate={{ y: animateY, opacity: 1 }}
            exit={{ y: exitY, opacity: 0 }}
          >
            <div className="inline-flex items-center justify-center gap-4 rounded-lg border border-green-300 bg-green-50 px-12 py-4 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.12)]">
              {icon && icon}
              <div className="flex flex-col items-start">
                <p className="text-base leading-6 font-semibold text-green-700">{title}</p>
                {description ? (
                  <p className="text-sm leading-5 font-normal text-green-600">{description}</p>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Portal을 사용하여 body에 직접 렌더링
  return createPortal(toastContent, document.body);
};

export const BottomToast = Toast;
