import React, {useEffect, useRef, useState} from "react";
import BasicLayout from "../../layout/BasicLayout.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {formatTimer} from "../../common/util/date.tsx";
import LoadingLayout from "../../layout/LoadingLayout.tsx";
import {checkCode} from "../../common/apis/member.tsx";

function CodePage() {

    const {state} = useLocation();
    const {email} = state;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const inputRefs = useRef<HTMLInputElement[]>([]);
    const [code, setCode] = useState<string>("");

    const [timer, setTimer] = useState(600);

    const handleChange = (index: number, value: string) => {
        let newCode = code;
        for (const digit of value.split("")) {
            if (/[^0-9]/g.test(digit)) {
                return;
            }

            newCode += digit;
        }

        setCode(newCode.substring(0, 6));

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + Math.min(value.length, 5)].focus();
        }
    };

    const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === "Backspace" && index > 0) {
            setCode(code.substring(0, index - 1));
            inputRefs.current[index - 1].focus();
        }
    };

    useEffect(() => {
        if (inputRefs.current) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        let interval = null;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval!);
            alert("유효 시간이 만료되었습니다. 회원가입을 다시 시도해주세요.");
        }

        return () => clearInterval(interval!);
    }, [timer]);

    useEffect(() => {
        if (code.length >= 6) {
            setLoading(true);

            checkCode(email, code)
                .then(() => {
                    navigate("/signup", {state: {email: email, code: code}});
                })
                .catch((error) => {
                    alert(error.response.data.message);
                    if (inputRefs.current) {
                        inputRefs.current[5].focus();
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [code]);

    return (
        <BasicLayout center={true}>
            <div
                className="w-full max-w-[calc(420px)] flex flex-col justify-center items-center gap-y-2 mb-8">
                <div className="flex flex-col gap-y-1 mb-4 text-center font-normal text-gray-600">
                    <p><span className="font-black text-gray-900">{email}</span> 로 보내진</p>
                    <p>인증코드 6자리를 입력해주세요.</p>
                </div>
                <div className="flex items-center justify-center gap-2 my-4">
                    {Array.from({length: 6}).map((_, index) => (
                        <React.Fragment key={index}>
                            <input
                                ref={(el) => {
                                    if (el) {
                                        inputRefs.current[index] = el;
                                    }
                                }}
                                type="text"
                                maxLength={6}
                                className="w-12 h-16 rounded-lg font-bold text-lg appearance-none border border-gray-200 text-center focus:outline-1"
                                value={code[index] ?? ""}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => {
                                    handleBackspace(e, index)
                                }}
                            />
                        </React.Fragment>
                    ))}
                </div>
                <div className="mt-4">
                    유효시간 : {formatTimer(timer)}
                </div>
            </div>
            <LoadingLayout loading={loading}/>
        </BasicLayout>
    )
        ;
}

export default CodePage;