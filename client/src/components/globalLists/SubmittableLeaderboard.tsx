import { useState, useEffect, type ReactElement } from "react"
import { type SubmitResult, type SubmitSectionTextsBase, type SubmittableGlobalBoardPropsBase } from "../../../types/api/globalBoards"
import { styles } from "../../style"
import { type LeaderboardProps, Leaderboard } from "./Leaderboard"
import { nameRefusedErrorCode, postQueryNetworkErrorCode, postQueryRefusedErrorCode, queryErrorCode } from "../../constants/components/globalLists"
import { getThemeStyles } from "../../style"
import { getOnKeyDownInputEventDuplicator } from "../../constants/components/input/input"

export type SubmittableLeaderboardProps = LeaderboardProps & SubmittableGlobalBoardPropsBase &  {
    scoreFormatFunction? : (score : number | undefined) => string
    scoreStorageFactor? : number,
    scoreComparisonFunction? : (a : number, b : number) => boolean,
    placeholderScore? : string,
    submitSectionTexts : SubmitSectionTextsBase & {
        placeholderScore? : string,
    }
}

const defaultSubmitSectionTexts = {
    submitSectionTitle: "Best Score",
    placeholderScore: " -",
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
    scoreComparisonFunction = (a : number, b : number) => a > b,
    
} : SubmittableLeaderboardProps) : [ReactElement, (candidateScore : number) => void]{
    const { submitSectionTitle, placeholderName, submitButtonText } = {...defaultSubmitSectionTexts, ...submitSectionTexts}
    const [bestScore, setbestScore] = useState<number | undefined>(undefined)
    const [submitName, setSubmitName] = useState("")
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [bestSubmittedScore, setBestSubmittedScore] = useState<number | undefined>(undefined)
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
        if (bestScore == undefined || scoreComparisonFunction(newScore, bestScore)) {
            setbestScore(newScore)
        }
    }

    function submitBlocked() {
        return bestSubmittedScore != undefined && bestScore != undefined && scoreComparisonFunction(bestSubmittedScore, bestScore)
    }

    function canSubmit() {
        return bestScore != undefined && !submitButtonDisabled && submitName.trim() && !submitBlocked()
    }

    
    const [leaderboard, submitScore] = Leaderboard({
        title,
        category,
        boardSubTitles,
        entriesState,
        count,
        scoreStorageFactor,
        scoreFormatFunction,
        theme
    })

    const onSubmitScorePressed = async () => {
        if (!canSubmit() || submitButtonDisabled || bestScore == undefined || !submitName.trim()) {
            return
        }
        const result = await submitScore(bestScore, submitName.trim())

        const submitResult : SubmitResult= (() => {
            if (result >= 0) {
                setBestSubmittedScore(bestScore.valueOf())

                return {
                    message: `You (${submitName}) are now top ${result + 1} with a score of [${scoreFormatFunction(bestScore.valueOf())}]!`,
                    isError: false,
                };
            }
            switch(result) {
                case nameRefusedErrorCode:
                    return {
                        message: "Name not accepted",
                        isError: true,
                    }
                case postQueryNetworkErrorCode:
                    return {
                        message: "Could not send to leaderboard",
                        isError: true,
                    }
                case postQueryRefusedErrorCode:
                    return {
                        message: "Your name already has at least this score!",
                        isError: true
                    }
                case queryErrorCode:
                    return {
                        message: "Error sending request",
                        isError: true
                    }
                default:
                    return {
                        message: "Failed to submit to leaderboard",
                        isError: true
                    }
            }
        })();
        setSubmitResult(submitResult) 
    }

    return [(
        <div className="flex flex-row gap-5">
          <div className="w-[calc(15%+50px)] h-[70%] my-auto flex flex-col items-center justify-center">
            <p className={`text-white/80 text-center text-md sm:text-xl ${getThemeStyles(theme)}`}>
              {submitSectionTitle}
            </p>

            <p
              className={`${styles.techStackMatchStyle.buttonTextSizeStyle} ${getThemeStyles(theme)} text-secondary text-center tracking-wider text-xs sm:text-lg pt-5 pb-5`}
            >
              {scoreFormatFunction(bestScore)}
            </p>
            
            <input
              type="text"
              value={submitName}
              disabled={submitBlocked()}
              onKeyDown={getOnKeyDownInputEventDuplicator(
                (newValue : string) => {setSubmitName(newValue.trim())}, 
                (candidateName : string) => candidateName.length < maxNameLength)
              }placeholder={placeholderName}
              onChange={() => {}}
              maxLength={20}
              className={`${getThemeStyles(theme)} w-full mb-5 mt-5 px-2 py-2 rounded-lg border-2 border-white/10 bg-white/10 text-white placeholder-white/40 text-center focus:outline-hidden focus:border-secondary`}
            />
            <button 
              className={`${canSubmit() ? "cursor-pointer bg-white/15" : "cursor-default bg-white/10"} ${styles.techStackMatchStyle.buttonHeightStyle}  rounded-lg border-2 border-white/10 flex items-center justify-center`}
              onClick={onSubmitScorePressed}
            >
              <p
                className={`text-xs sm:text-xl ${styles.techStackMatchStyle.buttonTextSizeStyle} ${getThemeStyles(theme)} ${canSubmit() ? "text-secondary" : "text-secondary/50"}  tracking-wider text-center pl-1 pr-1`}
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
          {leaderboard}
        </div>
    ),
    attemptSubmitScore
    ]
}