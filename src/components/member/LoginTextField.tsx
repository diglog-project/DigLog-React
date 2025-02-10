import * as React from "react";

function LoginTextField({label, type, placeholder, value, setValue, onKeyDown}: {
    label?: string,
    type: string,
    placeholder: string,
    value: string,
    setValue: (value: string) => void,
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void,
}) {
    return (
        <div className="mb-6 w-full">
            <label htmlFor={type} className="block mb-3 text-md font-medium text-gray-900">
                {label}
            </label>
            <input type={type}
                   placeholder={placeholder} required
                   className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                   value={value}
                   onChange={(event => setValue(event.target.value))}
                   onKeyDown={onKeyDown}/>
        </div>
    );
}

export default LoginTextField;