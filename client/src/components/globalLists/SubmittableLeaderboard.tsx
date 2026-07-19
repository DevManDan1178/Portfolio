import { useState, useEffect, type ReactElement } from "react"
import { type SubmitResult } from "../../../types/api/globalBoards"
import { styles } from "../../style"
import { type LeaderboardProps, Leaderboard } from "./Leaderboard"
import { postQueryNetworkErrorCode, postQueryRefusedErrorCode } from "../../constants/components/globalLists"

export type SubmittableLeaderboardProps = LeaderboardProps & {
    scoreFormatFunction? : (score : number | undefined) => string
    scoreStorageFactor? : number,
    submitButtonCooldown? : number,
    scoreComparisonFunction? : (a : number, b : number) => boolean
}

export default function({
    category,
    title,
    subTitles,
    entriesState,
    count,
    scoreFormatFunction = (score : number | undefined) => `${score}`,
    scoreStorageFactor = 1,
    submitButtonCooldown = 3000,
    scoreComparisonFunction = (a : number, b : number) => a > b
} : SubmittableLeaderboardProps) : [ReactElement, (candidateScore : number) => void]{
    
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
        subTitles,
        entriesState,
        count,
        scoreStorageFactor,
        scoreFormatFunction
    })

    const onSubmitScorePressed = async () => {
        if (bestScore == undefined || !submitName.trim()) {
            return
        }
        const result = await submitScore(bestScore, submitName)

        const submitResult : SubmitResult= (() => {
        if (result >= 0) {
            setBestSubmittedScore(bestScore.valueOf())

            return {
                message: `You (${submitName}) are now top ${result + 1} with a score of [${scoreFormatFunction(bestScore.valueOf())}]!`,
                isError: false,
            };
        }
        switch(result) {
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
        <div className="flex">
          <div className="w-[calc(15%_+_50px)] flex flex-col items-center justify-center">
            <p className="text-white/80 text-center text-md sm:text-xl">
              Best Score
            </p>

            <p
              className={`${styles.techStackMatchStyle.buttonTextSizeStyle} text-secondary text-center tracking-wider text-xs sm:text-lg pt-5 pb-5`}
            >
              {scoreFormatFunction(bestScore)}
            </p>
            
            <input
              type="text"
              value={submitName}
              disabled={submitBlocked()}
              onChange={(e) => setSubmitName(e.target.value)}
              placeholder="[Name]"
              maxLength={20}
              className="w-full mb-5 mt-5 px-2 py-2 rounded-lg border-2 border-white/10 bg-white/10 text-white placeholder-white/40 text-center focus:outline-none focus:border-secondary"
            />
            <button 
              className={`${canSubmit() ? "cursor-pointer bg-white/15" : "cursor-default bg-white/10"} ${styles.techStackMatchStyle.buttonHeightStyle}  rounded-lg border-2 border-white/10 flex items-center justify-center`}
              onClick={onSubmitScorePressed}
            >
              <p
                className={`text-xs sm:text-xl ${styles.techStackMatchStyle.buttonTextSizeStyle} ${canSubmit() ? "text-secondary" : "text-secondary/50"}  tracking-wider text-center pl-1 pr-1`}
              >
                Submit score
              </p>
            </button>
            {submitResult.message && 
             <div className="px-5 py-6 text-center bg-neutral-950/40">
                <p className={`${submitResult.isError ? "text-red-400/80" : "text-white/80"} text-sm mb-3`}>
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