const MAX_AI_REQUESTS = 250

let aiRequestCount = 0

export const canMakeAIRequest = (): boolean => {

    return aiRequestCount < MAX_AI_REQUESTS

}

export const incrementAIRequestCounter = (): void => {
    aiRequestCount += 1

    console.log(
        `OpenAI API requests: ${aiRequestCount}/${MAX_AI_REQUESTS}`
    );
}

export const getAIRequestCount = (): number => {
    return aiRequestCount
}

export const getRemainingAIRequests = (): number => {
    return MAX_AI_REQUESTS - aiRequestCount
}

