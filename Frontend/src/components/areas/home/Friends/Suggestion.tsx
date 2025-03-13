import { useNavigate } from "react-router-dom";
import defaultProfile from "../../../../assets/images/default-profile-pic.jpg";
import { User } from "../../../../models/User";

type SuggestionProps = {
    user: User;
};

export default function Suggestion({ user }: SuggestionProps): JSX.Element {
    const navigate = useNavigate()
    if (!user) return <></>;

    const {
        photos: { profilePhoto: profile, coverPhoto: cover },
        firstName,
        lastName,
        address
    } = user;

    return (
        <div
            style={{ backgroundImage: `url(${cover})` }}
            className="relative flex flex-col items-center justify-center bg-cover bg-center rounded-lg shadow-lg p-6 space-y-6 max-w-[540px] w-full bg-opacity-70 hover:bg-opacity-90 transition-all duration-300"
        >
            <div className="absolute inset-0 bg-black opacity-40 hover:opacity-50 transition-all duration-300 rounded-lg"></div>

            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img
                    src={profile || defaultProfile}
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => navigate(`/user-profile/${user?._id}`)}
                />
            </div>

            <div className="relative text-center space-y-2 z-10">
                <h3 className="text-2xl font-semibold text-white transition-all duration-300 hover:text-yellow-400">{`${firstName} ${lastName}`}</h3>
                <p className="text-white text-sm transition-all duration-300 hover:text-gray-300">
                    {`${address?.country} / ${address?.state} / ${address?.city}` || "Unknown Location"}
                </p>
            </div>
        </div>
    );
}
