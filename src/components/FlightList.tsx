import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFlights } from '../store/flightSlice';
import { RootState } from '../store/store';
import { Ticket } from '../../types/Ticket';
import styles from '../ModuleCSS/FlightList.module.css'

const FlightList: React.FC = () => {
  const dispatch = useDispatch();
  const { flights, status } = useSelector((state: RootState) => state.flights);
  
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const [sortType, setSortType] = useState<'cheap' | 'fast' | 'optimal'>('cheap');

  const [selectedConnections, setSelectedConnections] = useState<number[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter(!showFilter);

  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);

  const handleConnectionChange = (connections: number) => {
    setSelectedConnections(prev =>
      prev.includes(connections) ? prev.filter(c => c !== connections) : [...prev, connections]
    );
  };

  const handleCompanyChange = (company: string) => {
    setSelectedCompanies(prev =>
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
  };

  const filteredFlights = flights
    .filter(flight => 
      flight.from.toLowerCase().includes(fromCity.toLowerCase()) &&
      flight.to.toLowerCase().includes(toCity.toLowerCase()) &&
      (selectedConnections.length === 0 || selectedConnections.includes(flight.connectionAmount)) && 
      (selectedCompanies.length === 0 || selectedCompanies.includes(flight.company))
    )
    .sort((a, b) => {
      if (sortType === 'cheap') {
        return a.price - b.price;
      } else if (sortType === 'fast') {
        return a.duration - b.duration;
      } else {
        return a.price + a.duration - (b.price + b.duration);
      }
    })
  .slice(0, visibleCount);

  if (status === 'loading') {
    return <p>Загрузка...</p>;
  }

  if (status === 'failed') {
    return <p>Ошибка загрузки данных.</p>;
  }

  const getCompanyLogo = (company: string) => {
    switch (company) {
      case 'Победа':
        return '/images/logoPobeda.png';
      case 'Red Wings':
        return '/images/logoRedWings.png';
      case 'S7':
        return '/images/logoS7.png';
      default:
        return '';
    }
  };

  return (
    <div>
      {/* Поля для поиска */}
      <div className={styles.headContainer}>
        <div className={styles.headLogoContainer}>
            <img src="/images/logoHead.png" alt="Лого" />
            <h1 className={styles.headTitle}>Поиск авиабилетов</h1>
        </div> 
        {/* <div className={styles.headInputContainer}>
            <input 
            type="text"
            placeholder="Откуда"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            />
            <input 
            type="text"
            placeholder="Куда"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            />
        </div> */}
      </div>

      <div className={styles.sortContainer}>
        {/* Блок фильтрации */}
        <div className={styles.filterContainer}>
          {/* Фильтр по пересадкам */}
          <div className={styles.filterBlock}>
            <h3>Количество пересадок</h3>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox"
                onChange={() => handleConnectionChange(0)} 
                checked={selectedConnections.includes(0)} 
              />
              <span className={styles.checkboxSpan}></span> Без пересадок
            </label>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                onChange={() => handleConnectionChange(1)} 
                checked={selectedConnections.includes(1)} 
              />
              <span className={styles.checkboxSpan}></span> 1 пересадка
            </label>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                onChange={() => handleConnectionChange(2)} 
                checked={selectedConnections.includes(2)} 
              />
              <span className={styles.checkboxSpan}></span> 2 пересадки
            </label>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                onChange={() => handleConnectionChange(3)} 
                checked={selectedConnections.includes(3)} 
              />
              <span className={styles.checkboxSpan}></span> 3 пересадки
            </label>
          </div>

          {/* Фильтр по авиакомпаниям */}
          <div className={styles.filterBlock}>
            <h3>Компании</h3>
            <label className={styles.radioLabel}>
              <input 
                type="checkbox" 
                onChange={() => handleCompanyChange('Победа')} 
                checked={selectedCompanies.includes('Победа')} 
              />
              <span className={styles.radioSpan}></span> Победа
            </label>
            <label className={styles.radioLabel}>
              <input 
                type="checkbox" 
                onChange={() => handleCompanyChange('Red Wings')} 
                checked={selectedCompanies.includes('Red Wings')} 
              />
              <span className={styles.radioSpan}></span> Red Wings
            </label>
            <label className={styles.radioLabel}>
              <input 
                type="checkbox" 
                onChange={() => handleCompanyChange('S7')} 
                checked={selectedCompanies.includes('S7')} 
              />
              <span className={styles.radioSpan}></span> S7 Airlines
            </label>
          </div>
        </div>
        <div>
          {/* Кнопки для сортировки */}
          <div className={styles.sortButtonsContainer}>
            <button className={`${styles.sortButtons} ${styles.sortButtonsLeft} ${styles.active}`} onClick={() => setSortType('cheap')}>Самый дешевый</button>
            <button className={`${styles.sortButtons} ${styles.sortButtonsMiddle}`} onClick={() => setSortType('fast')}>Самый быстрый</button>
            <button className={`${styles.sortButtons} ${styles.sortButtonsRight}`} onClick={() => setSortType('optimal')}>Самый оптимальный</button>
          </div>

          {/* Кнопка для мобильного выпадающего фильтра */}
        <button className={styles.filterToggleButton} onClick={toggleFilter}>
          <p>Любая авиакомпания, любое кол-во пересадок</p>
          <p className={styles.filterToggleButtonText}>Открыть настройки <img src="/images/arrowDown.png" alt="Выпадающее меню" /></p>
        </button>
        {showFilter && (
          <div className={styles.filterDropdown}>
            <div className={`${styles.filterBlock} ${styles.filterBlockLeft}`}>
              <h3>Компании</h3>
              <label className={styles.radioLabel}>
              <input 
                type="checkbox" 
                onChange={() => handleCompanyChange('Победа')} 
                checked={selectedCompanies.includes('Победа')} 
              />
              <span className={styles.radioSpan}></span> Победа
              </label>
              <label className={styles.radioLabel}>
                <input 
                  type="checkbox" 
                  onChange={() => handleCompanyChange('Red Wings')} 
                  checked={selectedCompanies.includes('Red Wings')} 
                />
                <span className={styles.radioSpan}></span> Red Wings
              </label>
              <label className={styles.radioLabel}>
                <input 
                  type="checkbox" 
                  onChange={() => handleCompanyChange('S7')} 
                  checked={selectedCompanies.includes('S7')} 
                />
                <span className={styles.radioSpan}></span> S7 Airlines
              </label>
            </div>

            <div className={`${styles.filterBlock} ${styles.filterBlockRight}`}>
              <h3>Количество пересадок</h3>
              <label className={styles.checkboxLabel}>
              <input 
                type="checkbox"
                onChange={() => handleConnectionChange(0)} 
                checked={selectedConnections.includes(0)} 
              />
              <span className={styles.checkboxSpan}></span> Без пересадок
              </label>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  onChange={() => handleConnectionChange(1)} 
                  checked={selectedConnections.includes(1)} 
                />
                <span className={styles.checkboxSpan}></span> 1 пересадка
              </label>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  onChange={() => handleConnectionChange(2)} 
                  checked={selectedConnections.includes(2)} 
                />
                <span className={styles.checkboxSpan}></span> 2 пересадки
              </label>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  onChange={() => handleConnectionChange(3)} 
                  checked={selectedConnections.includes(3)} 
                />
                <span className={styles.checkboxSpan}></span> 3 пересадки
              </label>
            </div>
          </div>
        )}

          {/* Отображение отфильтрованных рейсов */}
          {filteredFlights.length ? (
            filteredFlights.map((flight: Ticket) => (
              <div key={flight.id} className={styles.flightItem}>
                <div>
                    <p className={styles.flightItemPrice}>{flight.price} {flight.currency}</p>
                </div>
                <div>
                    {/* <p className={styles.flightItemDate}>{flight.date}</p> */}
                </div>
                <div>
                    <img src={getCompanyLogo(flight.company)} alt={flight.company} className={styles.flightCompanyLogo} />
                </div>
                <div>
                    <h3 className={styles.flightItemDestination}>{flight.from} → {flight.to}</h3>
                    <p className={styles.flightItemTimeDA}>{flight.time.departure} - {flight.time.arrival}</p>
                </div>
                <div>
                    <p className={styles.flightItemTimeDurationTitle}>В пути</p>
                    <p className={styles.flightItemTimeDuration}>{Math.floor(flight.duration / 60)} ч {flight.duration % 60} мин</p>
                </div>
                <div>
                    <p className={styles.flightItemConectionTitle}>Пересадки</p>
                    <p className={styles.flightItemConection}>{flight.connectionAmount === 0 
                                                                ? 'Без пересадок' 
                                                                : flight.connectionAmount === 1 
                                                                ? '1 пересадка' 
                                                                : `${flight.connectionAmount} пересадки`}
                    </p>
                </div>
              </div>
            ))
          ) : (
            <p>Рейсов не найдено.</p>
          )}

          {/* Кнопка для загрузки еще билетов */}
          {filteredFlights.length < flights.length && (
            <button className={styles.flightListButton} onClick={() => setVisibleCount(prev => prev + 3)}>
              Загрузить еще билеты
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightList;