export default function prettyURLConverter(uglyURL) {
    return uglyURL.toLowerCase().replace(/ /ig, "-")
}