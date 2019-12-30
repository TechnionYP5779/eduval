export function capitalize(str)
{
    return str.toLowerCase()
        .split(' ')
        .map((word) => (word[0].toUpperCase() + word.substr(1)))
        .join(' ');
}
