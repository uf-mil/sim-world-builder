const DownloadButton = props => {
    return (
        <a
            href="/test.world"
            download="test.world"
            className="border-2 w-1/3 py-2 rounded-lg mt-5"
        >
            Download World
        </a>
    )
}
export default DownloadButton;