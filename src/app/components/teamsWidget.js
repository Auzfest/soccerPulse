import React from 'react';
import TeamWidget from './teamWidget';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

export default function teamWidget({ teams }) {
  const team = [teams];
    if (!team || team.length === 0) {
        return <p>No team available.</p>;
      }
    
      return (
        <div className='flex flex-wrap justify-center gap-[10px]'>
          {team.map((teamed, index) => (
            <div className=' mx-auto border border-gray-300 rounded-md p-4 bg-gray-300 w-full' key={index}>
              <TeamWidget key={index} leagueId={teamed.leagueId} teamId={teamed.teamId} />
            </div>
          ))}
        </div>
  );
}
