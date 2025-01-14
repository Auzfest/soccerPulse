import React from 'react';
import GameWidget from './teamWidget';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';

export default function TeamsWidget({ teams }) {
    if (!teams || teams.length === 0) {
        return <p>No teams available.</p>;
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
          {teams.map((team, index) => (
            <SwiperSlide key={index}>
              <GameWidget key={index} leagueId={team.leagueId} teamId={team.teamId} />
            </SwiperSlide>
          ))}
          </Swiper>
        </div>
  );
}
