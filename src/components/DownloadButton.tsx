function DownloadButton() {
    return (
        <a
            href="/test.world"
            download="test.world"
            className="bg-gray-700 w-30 mt-4 rounded-xl border-1 py-1"
        >
            Download World
        </a>
    )
}
export default DownloadButton;