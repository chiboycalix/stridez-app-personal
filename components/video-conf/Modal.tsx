
interface ModalProps {
  children: React.ReactNode
}

export default function Modal({ children }: ModalProps) {

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#14142B] text-white rounded-lg p-6 max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
}