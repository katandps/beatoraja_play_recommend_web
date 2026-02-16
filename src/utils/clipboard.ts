const fallbackCopy = (text: string): boolean => {
    try {
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.setAttribute("readonly", "")
        textArea.style.position = "fixed"
        textArea.style.opacity = "0"
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        return true
    } catch (error) {
        return false
    }
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text)
            return true
        }
    } catch (error) {
        return fallbackCopy(text)
    }
    return fallbackCopy(text)
}
