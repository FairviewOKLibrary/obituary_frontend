'use client';
import React from 'react';
import Image from "next/image";
import styles from "@/styles/page.module.scss";
import { useEffect, useState } from "react";
import { debounce } from "@/lib/debounce";
import BackToTop from '@/components/BackToTop';
import { Pagination } from "react-bootstrap";
import Modal from '@/components/obitModal';
import { JetBrains_Mono } from 'next/font/google';

const Home = ({ searchParams }: any) => {
  // const show: any = React.use(searchParams?.show);
  const [show, setShow] = useState(false);

  const [reloadData, setReloadData] = useState(false);

  const [initialPageLoad, setInitialPageLoad] = useState(true);
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [oldPage, setOldPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [oldSearchedValue, setOldSearchValue] = useState('');
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [limit, setLimit] = useState(50);
  const [recievedLimit, setRecievedLimit] = useState(0);
  const redacted = 'redacted';
  const [selectedObit, setSelectedObit] = useState({});
  const [filteringType, setFilteringType] = useState('q');

  const limitAmount: any = [50, 100, 250, 500];
  const filterType: any = [
    {
      queryType: 'q',
      displayName: 'Search All'
    },
    {
      queryType: 'last_name',
      displayName: 'Last Name'
    },
    {
      queryType: 'first_name',
      displayName: 'First Name'
    },
    {
      queryType: 'born',
      displayName: 'Birthday'
    },
    {
      queryType: 'death',
      displayName: 'Deathday'
    },
    {
      queryType: 'location',
      displayName: 'Gravestone Location'
    },
  ]


  const getData = async () => {
    // let test = inputValue === "" || inputValue === oldSearchedValue && limit === recievedLimit;
    // console.log(`Test: ${test}`)
    // if (test && !initialPageLoad || page !== oldPage) return;
    // setInitialPageLoad(false)
    // setLoading(true)

    const url = `http://localhost:3001/obituary/search?${filteringType}=${inputValue}&limit=${limit}&page=${page * limit}`;
    try {
      console.log(inputValue)
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=180, public'
        }
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json)
      setData(json.results);
      setOldSearchValue(inputValue)
      setTotalPages(Math.ceil(json.total / json.limit))
      setRecievedLimit(json.sentLimit)
      setMsg(json.message ?? `Total Found: ${json.total || 0} / ${json.limit || 0}`)
      setLoading(false)
      console.log(`Total: ${json.total} limit: ${json.limit} combined: ${Math.ceil(json.total / json.limit)}`)

    } catch (error: any) {
      setError(true)
      setMsg(error.msg)
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (reloadData) {
      console.log('data gotten')
      getData()
      setReloadData(false)
    }

  }, [reloadData])


  return (
    <>
      <BackToTop />
      <div className={styles.page}>
        <div>
          {page + 1}
          <p>It is this Library's goal to provide as much resource material to our local community...</p>
        </div>
        <br />
        {
          totalPages > 1 ?
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => <Pagination.Item key={i} onClick={() => { setPage(i); setReloadData(true) }}>{i + 1}</Pagination.Item>)}
            </Pagination>
            :
            null
        }
        <br />
        <form onSubmit={(e => e.preventDefault())}>
          <select name="filtering" id="filtering" defaultValue={filteringType}>
            {
              filterType.map((obj: any, i: number) => (<option key={i} value={obj.queryType.toString()} onClick={() => setFilteringType(obj.queryType)}>{obj.displayName}</option>))
            }
          </select>

          <input
            type="text"
            style={{ width: '50%' }}
            placeholder={'Search (Name, Birth or Death Year)'}
            onChange={(e) => { setPage(0); setInputValue(e.target.value) }}
            disabled={toggle}
          />
          {/*
           <select name="limit" id="limit" defaultValue={limit}>
            {
               limitAmount.map((num: number, i: number) => (<option key={i} value={num.toString()} onClick={() => setLimit(num)}>{num}</option>))
            }
         </select>
  */}
          <br />
          {!!msg ? msg : null}
          <br />
          <button
            className='m-2 p-2'
            onClick={() => setReloadData(true)}>Search Query</button>
        </form>
        <ul>
          {loading === true ?
            'Checking cool stuff...'
            :
            data?.map((o: any, i: number) => {

              console.log(o.thumbnail)
              return (
                <div key={i} className={styles.flex} onClick={() => setShow(true)}>
                  {i + 1}
                  <li>
                    {
                      !!o.link ?
                        <a href={o.link} target="_blank">
                          {
                            !!o.thumbnail ?
                              <Image src={o.thumbnail} alt={o.text} width={250} height={250} loading="lazy" />
                              :
                              'image not available'

                          }
                        </a>
                        :
                        'Pulled from Library Database'
                    }
                    <br />
                    Name: {o.first_name} {o.last_name}
                    <br />
                    Born: {o.birth ?? redacted}
                    <br />
                    Death: {o.death ?? redacted}
                    <br />
                    Maiden Name: {o.maidenName ?? redacted}
                    <br />
                    description: {o.text ?? redacted}
                  </li>
                  <hr />
                </div>
              )
            })}
        </ul>
      </div>
      {page + 1}
      <br />
      {
        totalPages > 1 ?
          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => <Pagination.Item key={i} onClick={() => { setPage(i); setReloadData(true) }}>{i + 1}</Pagination.Item>)}
          </Pagination>
          :
          null
      }
    </>
  );
};

export default Home;
