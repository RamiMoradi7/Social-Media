import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { addressService } from "../../../services/AddressService";
import { City, Country, State } from "../../../types/AddressTypes";
import { notify } from "../../../utilities/Notify";
import AddressSelect from "../../common/inputs/AddressSelect";

type AddressSelectProps = {
    defaultValues: {
        country?: string;
        state?: string;
        city?: string;
    };
};

export default function AddressSelectForm({
    defaultValues,
}: AddressSelectProps): JSX.Element {
    const { data: countries } = useFetch(() => addressService.getCountries());
    const [states, setStates] = useState<State[]>(null);
    const [cities, setCities] = useState<City[]>(null);

    const handleCountryChange = async (countryName: string) => {
        try {
            const statesByCountry = await addressService.getStatesByCountryName(
                countryName
            );
            setStates(statesByCountry);
        } catch (err: any) {
            notify.error(err);
        }
    };
    const handleStateChange = async (stateName: string) => {
        try {
            const citiesByState = await addressService.getCitiesByStateName(
                stateName
            );
            if (!citiesByState.length) {
                setCities([{ city_name: stateName }]);
            } else {
                setCities(citiesByState);
            }
        } catch (err: any) {
            notify.error(err);
        }
    };

    return (
        <>
            <div className="md:col-span-2">
                <label htmlFor="country">Country / region</label>
                <AddressSelect<Country>
                    field="country_name"
                    name="country"
                    registerName="address.country"
                    values={countries}
                    onChange={handleCountryChange}
                    message="Loading countries.."
                    defaultValue={defaultValues?.country}
                />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="state">State / province</label>
                <AddressSelect<State>
                    field="state_name"
                    name="state"
                    registerName="address.state"
                    values={states}
                    onChange={handleStateChange}
                    message="Select country first"
                    defaultValue={defaultValues?.state}
                />
            </div>
            <div className="md:col-span-1">
                <label htmlFor="city">City</label>
                <AddressSelect<City>
                    field="city_name"
                    name="city"
                    registerName="address.city"
                    values={cities}
                    message="Select state first"
                    defaultValue={defaultValues?.city}
                />
            </div>
        </>
    );
}
