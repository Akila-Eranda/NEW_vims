function base64ToJson(base64String) {
    const decoded = JSON.parse(
        new TextDecoder().decode(
            Uint8Array.from(atob(base64String), c => c.charCodeAt(0))
        )
    );

    return decoded

}

