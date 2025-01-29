import React from 'react';
import TeamWidget from './teamWidget';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';

export default function teamWidget({ teams }) {
  const team = [teams];
  console.log(team);
    if (!team || team.length === 0) {
        return <p>No team available.</p>;
      }
    
      return (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
        }}>
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            navigation={true}
            modules={[Navigation]}
            pagination={{ clickable: true }}
            loop={true}
          >
          {team.map((teamed, index) => (
            <SwiperSlide key={index}>
              <div className='w-10/12 mx-auto border border-gray-300 rounded-md p-4 bg-gray-300'>
              <TeamWidget key={index} leagueId={teamed.leagueId} teamId={teamed.teamId} />
              </div>
            </SwiperSlide>
          ))}
          </Swiper>
        </div>
  );
}
