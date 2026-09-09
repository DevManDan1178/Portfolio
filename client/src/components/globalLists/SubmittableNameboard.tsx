import { useEffect, useState, type ReactElement } from "react";
import { type SubmitResult, type SubmittableGlobalBoardPropsBase } from "../../../types/api/globalBoards";
import { styles, getThemeStyles } from "../../style";
import { useNameboard, type NameboardProps } from "./Nameboard";
import { nameRefusedErrorCode, postQueryNetworkErrorCode, postQueryRefusedErrorCode, queryErrorCode } from "../../constants/components/globalLists";
import { getOnKeyDownInputEventDuplicator } from "../../constants/components/input/input";
import { type NameboardEntry } from "../../../../shared/types/api/globalBoards/nameboard";

export type useSubmittableNameboardProps = Omit<NameboardProps, "entriesState"> & SubmittableGlobalBoardPropsBase;

const defaultSubmitSectionTexts = {
    placeholderName: "[Name]",
    submitButtonText: "Submit",
    submitSectionTitle: "Submit Name",
}

export default function useSubmittableNameboard({
    title,
    category,
    count,
    boardSubTitles,
    queryOrder,
    maxNameLength,
    theme = {},

    submitSectionTexts,
    submitButtonCooldown = 1000,
}: useSubmittableNameboardProps): [ReactElement, (submitEnabled : boolean) => void] {
    const { submitSectionTitle, placeholderName, submitButtonText } = {...defaultSubmitSectionTexts, ...submitSectionTexts}
    const entriesState = useState<NameboardEntry[]>([]);
    const [submitName, setSubmitName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [submitEnabled, setSubmitEnabled] = useState(false);
    const [submitResult, setSubmitResult] = useState<SubmitResult>({
        message: "",
        isError: false,
    });

    useEffect(() => {
        if (!submitButtonDisabled) {
            return;
        }
        const timeout = setTimeout(() => {
            setSubmitButtonDisabled(false);
        }, submitButtonCooldown);

        return () => clearTimeout(timeout);
    }, [submitButtonDisabled, submitButtonCooldown]);

    const [nameboard, submitEntry] = useNameboard({
        title,
        category,
        count,
        boardSubTitles,
        entriesState,
        queryOrder,
        theme,
    });

    function canSubmit() {
        return submitName.trim().length > 0 && !submitButtonDisabled && !submitted && submitEnabled;
    }

    const onSubmitPressed = async () => {
        if (!canSubmit()) {
            return;
        }

        setSubmitButtonDisabled(true);

        const result = await submitEntry(submitName.trim());

        const submitResult: SubmitResult = (() => {
            if (result >= 0) {
                setSubmitted(true);

                return {
                    message: `You (${submitName}) have been added! Position ${result + 1}!`,
                    isError: false,
                };
            }

            switch (result) {
                case nameRefusedErrorCode:
                    return {
                        message: "Name not accepted",
                        isError: true,
                    }
                case postQueryNetworkErrorCode:
                    return {
                        message: "Could not send to nameboard.",
                        isError: true,
                    };

                case postQueryRefusedErrorCode:
                    return {
                        message: "Request refused!",
                        isError: true,
                    };
                case queryErrorCode:
                    return {
                        message: "Error sending request",
                        isError: true
                    }
                default:
                    return {
                        message: "Failed to submit.",
                        isError: true,
                    };
            }
        })();

        setSubmitResult(submitResult);
    };

    return [(
        <div className="flex flex-row justify-center gap-[clamp(1rem,5vw,10rem)]">
            <div className="w-[calc(15%+50px)] h-[70%] my-auto flex flex-col items-center justify-center">
                <p
                    className={`text-white/80 text-center text-md sm:text-xl ${getThemeStyles(theme)}`}
                >
                    {submitSectionTitle}
                </p>

                <input
                    type="text"
                    value={submitName}
                    disabled={submitted}
                    onKeyDown={getOnKeyDownInputEventDuplicator(
                      (newValue : string) => {setSubmitName(newValue.trim())}, 
                      (candidateName : string) => candidateName.length < maxNameLength)
                    }
                    placeholder={placeholderName}
                    onChange={() => {}}
                    maxLength={20}
                    className={`${getThemeStyles(theme)} w-full mb-5 mt-5 px-2 py-2 rounded-lg border-2 border-white/10 bg-white/10 text-white placeholder-white/40 text-center focus:outline-hidden focus:border-secondary`}
                />

                <button
                    className={`${canSubmit() ? "cursor-pointer bg-white/15" : "cursor-default bg-white/10"} ${styles.techStackMatchStyle.buttonHeightStyle} rounded-lg border-2 border-white/10 flex items-center justify-center`}
                    onClick={onSubmitPressed}
                >
                    <p
                        className={`text-xs sm:text-xl ${styles.techStackMatchStyle.buttonTextSizeStyle} ${getThemeStyles(theme)} ${canSubmit() ? "text-secondary" : "text-secondary/50"} tracking-wider text-center px-1`}
                    >
                        {submitButtonText}
                    </p>
                </button>

                {submitResult.message && (
                    <div className="px-5 py-6 text-center bg-neutral-950/40">
                        <p
                            className={`${submitResult.isError ? "text-red-400/80" : "text-white/80"} text-sm mb-3 ${getThemeStyles(theme)}`}
                        >
                            {submitResult.message}
                        </p>
                    </div>
                )}
            </div>
            <div>
              {nameboard}
            </div>     
        </div>
    ),
    setSubmitEnabled
    ]
}