interface Routine {
    name: string
    task: () => any
    isDone: boolean
    hasError: boolean
    wait: number
    frame: number
}

interface EventToken {
    eventName: string
    payload?: any
}

export {
    Routine,
    EventToken,
}