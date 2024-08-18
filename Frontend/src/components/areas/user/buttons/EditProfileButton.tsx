import { useState } from "react";
import Modal from "../../../common/Modal";
import EditSvg from "../../../common/svgs/Edit";
import UserForm from "../form/UserForm";

export default function EditProfileButton(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <button
                className=" rounded-lg relative w-48 h-10 cursor-pointer flex items-center border border-blue-500 bg-blue-500 group hover:bg-blue-500 active:bg-blue-500 active:border-blue-500"
                onClick={toggleModal}
            >
                <span className="text-gray-200 font-semibold ml-8  transform group-hover:translate-x-20 transition-all duration-300">
                    Edit Profile
                </span>
                <span className="absolute right-0 h-full w-10 rounded-lg bg-blue-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                    <EditSvg />
                </span>
            </button>
            {isOpen && (
                <Modal
                    toggleModal={toggleModal}
                    title={`Editing Profile`}
                    component={<UserForm toggleModal={toggleModal} />}
                />
            )}
        </>
    );
}
