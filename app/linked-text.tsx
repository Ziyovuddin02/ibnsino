export default function LinkedText({text}:{text:string}){
 const parts=text.split(/(https:\/\/[a-zA-Z0-9.-]+(?:\/[^\s]*)?|\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}|\b1206\b)/g);
 return <>{parts.map((part,i)=>part.startsWith('https://')?<a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>:part.startsWith('+998')||part==='1206'?<a key={i} href={'tel:'+part.replace(/\s/g,'')}>{part}</a>:part)}</>;
}
