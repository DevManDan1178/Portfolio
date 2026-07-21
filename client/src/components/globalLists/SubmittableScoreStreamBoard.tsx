import { useState, useEffect, type ReactElement } from "react"
import { type SubmitResult, type SubmitSectionTextsBase, type SubmittableGlobalBoardPropsBase } from "../../../types/api/globalBoards"
import { styles } from "../../style"
import { type ScoreStreamBoardProps, ScoreStreamBoard } from "./ScoreStreamBoard"
import { postQueryNetworkErrorCode, postQueryRefusedErrorCode, queryErrorCode } from "../../constants/components/globalLists"
import { getThemeStyles } from "../../style"
import { getOnKeyDownInputEventDuplicator } from "../../constants/components/input/input"

export type SubmittableScoreStreamBoardProps = ScoreStreamBoardProps & SubmittableGlobalBoardPropsBase & {
    scoreFormatFunction? : (score : number | undefined) => string
    scoreStorageFactor? : number,
    scoreComparisonFunction? : (a : number, b : number) => boolean,
    placeholderScore? : string,
    submitSectionTexts? : SubmitSectionTextsBase & {
        placeholderScore? : string
    }
}

const defaultSubmitSectionTexts = {
    submitSectionTitle: "Best Score",
    placeholderScore: "-",
    placeholderName: "[Name]",
    submitButtonText: "Submit Score",
}

export default function({
    category,
    title,
    boardSubTitles,
    entriesState,
    count,
    theme = {},
    
    maxNameLength,
    submitSectionTexts,
    scoreFormatFunction = (score : number | undefined) => `${score ?? (submitSectionTexts.placeholderScore ?? defaultSubmitSectionTexts.placeholderScore)}`,
    scoreStorageFactor = 1,
    submitButtonCooldown = 1000,

} : SubmittableScoreStreamBoardProps) : [ReactElement, (candidateScore : number) => void]{
    const { submitSectionTitle, placeholderName, submitButtonText } = {...defaultSubmitSectionTexts, ...submitSectionTexts}
    const [score, setScore] = useState<number | undefined>(undefined)
    const [submitName, setSubmitName] = useState("")
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [submittedScore, setSubmittedScore] = useState<number | undefined>(undefined)
    const [submitResult, setSubmitResult] = useState<SubmitResult>({
        message: "",
        isError: false
    })

    useEffect(() => {
        if (!submitButtonDisabled) return;
    
        const timeout = setTimeout(() => {
            setSubmitButtonDisabled(false)
        }, submitButtonCooldown);
    
        return () => clearTimeout(timeout);
    }, [submitButtonDisabled]);

    function attemptSubmitScore(newScore : number) {
        setScore(newScore)
    }

    function submitBlocked() {
        return submittedScore != undefined && score != undefined && submittedScore == score
    }

    function canSubmit() {
        return score != undefined && !submitButtonDisabled && submitName.trim() && !submitBlocked()
    }

    const [scoreStream, submitScore] = ScoreStreamBoard({
        title,
        category,
        boardSubTitles,
        entriesState,
        scoreStorageFactor,
        count,
        scoreFormatFunction: (score : number) => scoreFormatFunction(score),
        theme
    })

    const onSubmitScorePressed = async () => {
        if (!canSubmit() || submitButtonDisabled || score == undefined || !submitName.trim()) {
            return
        }

        setSubmitButtonDisabled(true)

        const result = await submitScore(score, submitName.trim())

        const submitResult : SubmitResult = (() => {
            if (result >= 0) {
                setSubmittedScore(score.valueOf())

                return {
                    message: `You (${submitName}) submitted a score of [${scoreFormatFunction(score.valueOf())}]!`,
                    isError: false,
                };
            }

            switch(result) {
                case postQueryNetworkErrorCode:
                    return {
                        message: "Could not send to score stream",
                        isError: true,
                    }

                case postQueryRefusedErrorCode:
                    return {
                        message: "Your score was refused!",
                        isError: true
                    }
                case queryErrorCode:
                    return {
                        message: "Error sending request",
                        isError: true
                    }
                default:
                    return {
                        message: "Failed to submit score",
                        isError: true
                    }
            }
        })();

        setSubmitResult(submitResult)
    }

    return [(
        <div className="flex flex-row gap-5">
            <div className="w-[calc(15%_+_50px)] h-[70%] my-auto flex flex-col items-center justify-center">
                <p className={`text-white/80 text-center text-md sm:text-xl ${getThemeStyles(theme)}`}>
                    {submitSectionTitle}
                </p>

                <p
                    className={`${styles.techStackMatchStyle.buttonTextSizeStyle} ${getThemeStyles(theme)} text-secondary text-center tracking-wider text-xs sm:text-lg pt-5 pb-5`}
                >
                    {scoreFormatFunction(score)}
                </p>

                <input
                    type="text"
                    value={submitName}
                    disabled={submitBlocked()}
                    onKeyDown={getOnKeyDownInputEventDuplicator(setSubmitName, (candidateName : string) => candidateName.length < maxNameLength)}
                    placeholder={placeholderName}
                    onChange={() => {}}
                    maxLength={20}
                    className={`${getThemeStyles(theme)} w-full mb-5 mt-5 px-2 py-2 rounded-lg border-2 border-white/10 bg-white/10 text-white placeholder-white/40 text-center focus:outline-none focus:border-secondary`}
                />

                <button
                    className={`${canSubmit() ? "cursor-pointer bg-white/15" : "cursor-default bg-white/10"} ${styles.techStackMatchStyle.buttonHeightStyle} rounded-lg border-2 border-white/10 flex items-center justify-center`}
                    onClick={onSubmitScorePressed}
                >
                    <p
                        className={`text-xs sm:text-xl ${styles.techStackMatchStyle.buttonTextSizeStyle} ${getThemeStyles(theme)} ${canSubmit() ? "text-secondary" : "text-secondary/50"} tracking-wider text-center pl-1 pr-1`}
                    >
                        {submitButtonText}
                    </p>
                </button>

                {submitResult.message &&
                    <div className="px-5 py-6 text-center bg-neutral-950/40">
                        <p className={`${submitResult.isError ? "text-red-400/80" : "text-white/80"} text-sm mb-3 ${getThemeStyles(theme)}`}>
                            {submitResult.message}
                        </p>
                    </div>
                }
            </div>

            {scoreStream}
        </div>
    ),
    attemptSubmitScore
    ]
}