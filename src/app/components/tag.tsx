import React from 'react'

interface tagProps {
    text: string;
    className?: string
}
 const Tag: React.FC<tagProps> = ({ text, className }) => {
     return (
        <div className={`${className} inline-block p-[4] border-2 border-[#016BF2] text-xs-medium font-medium text-primary-default  `}>
            {text}
        </div>
     )
 }

 export default Tag