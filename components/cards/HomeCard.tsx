import Image from 'next/image'

interface HomeCardProps {
  icon: string;
  title: string;
  subText: string;
  background: string;
  handleClick: () => void;
}

const HomeCard = ({
  icon,
  title,
  subText,
  background,
  handleClick
}: HomeCardProps) => {
  return (
    <div
      className={`flex min-h-[260px] w-full cursor-pointer flex-col justify-between rounded-[14px] ${background} px-4 py-6 xl:max-w-[270px]`}
      onClick={handleClick}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image src={icon} alt="meeting" width={27} height={27} />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{subText}</p>
      </div>
    </div>
  )
}

export default HomeCard
