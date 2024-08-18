import CancelSvg from "./svgs/Cancel";

type ModalProps = {
  toggleModal: () => void;
  component: JSX.Element;
  title?: string;
};

export default function Modal({
  toggleModal,
  component,
  title,
}: ModalProps): JSX.Element {
  return (
    <div className="fixed top-12 left-0 w-full h-full flex items-center justify-center z-50 ">
      <div
        className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50"
        onClick={toggleModal}
      ></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 max-w-screen-lg w-full max-h-full overflow-auto">
        <div className="flex justify-end">
          <button
            onClick={toggleModal}
            className="bg-gray-700 px-3 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-white rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300 absolute top-4 right-4"
          >
            <CancelSvg color="white"/>
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold py-4 text-gray-700">{title}</h2>
          <div className="font-bold text-sm text-gray-500 px-2">
            {component}
          </div>
        </div>
        <div className="mt-4 flex justify-center space-x-4"></div>
      </div>
    </div>
  );
}
