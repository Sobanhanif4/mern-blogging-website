import { useState } from "react"

const InputBox = ({ name, type, id, value, placeholder, icon }) => {

    const [passwordVisible, SetPasswordVisible] = useState(false)

    return (
        <div className="relative w-[100%] mb-4">
            <input
                placeholder={placeholder}
                type={type == "password" ? passwordVisible ? "text" : "password" : type}
                name={name}
                id={id}
                defaultValue={value}
                className="input-box"

            />

            <i className={"fi " + icon + " input-icon"}></i>
            {
                type == "password" ?
                    <i className={"fi fi-rr-eye" + (!passwordVisible ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"} onClick={() => SetPasswordVisible(currentVal => !currentVal)}></i> : ""
            }
        </div >

    )
}

export default InputBox
