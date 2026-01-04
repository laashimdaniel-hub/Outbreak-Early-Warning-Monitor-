--
-- PostgreSQL database dump
--

\restrict 9QMQuxs2oGvRqpzhDDV6JEeoG0LaKhlzNsdUjyhpdldiyK5SsFkWciO6PK1UUgj

-- Dumped from database version 17.7 (Debian 17.7-3.pgdg12+1)
-- Dumped by pg_dump version 17.7 (Debian 17.7-3.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerts (
    id integer NOT NULL,
    zone_id character varying(50) NOT NULL,
    date date NOT NULL,
    observed integer NOT NULL,
    baseline_mean double precision NOT NULL,
    baseline_std double precision NOT NULL,
    threshold double precision NOT NULL,
    severity character varying(10),
    status character varying(15) DEFAULT 'ACTIVE'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT alerts_severity_check CHECK (((severity)::text = ANY ((ARRAY['LOW'::character varying, 'MEDIUM'::character varying, 'HIGH'::character varying])::text[])))
);


ALTER TABLE public.alerts OWNER TO postgres;

--
-- Name: alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerts_id_seq OWNER TO postgres;

--
-- Name: alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;


--
-- Name: baselines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.baselines (
    id integer NOT NULL,
    zone_id character varying(50) NOT NULL,
    mean double precision NOT NULL,
    std double precision NOT NULL,
    calculated_on date NOT NULL
);


ALTER TABLE public.baselines OWNER TO postgres;

--
-- Name: baselines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.baselines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.baselines_id_seq OWNER TO postgres;

--
-- Name: baselines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.baselines_id_seq OWNED BY public.baselines.id;


--
-- Name: raw_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.raw_reports (
    id integer NOT NULL,
    date date NOT NULL,
    zone_id character varying(50) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    symptom_type character varying(50),
    observed integer
);


ALTER TABLE public.raw_reports OWNER TO postgres;

--
-- Name: raw_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.raw_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.raw_reports_id_seq OWNER TO postgres;

--
-- Name: raw_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.raw_reports_id_seq OWNED BY public.raw_reports.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    role character varying(30) DEFAULT 'analyst'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: alerts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);


--
-- Name: baselines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baselines ALTER COLUMN id SET DEFAULT nextval('public.baselines_id_seq'::regclass);


--
-- Name: raw_reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raw_reports ALTER COLUMN id SET DEFAULT nextval('public.raw_reports_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerts (id, zone_id, date, observed, baseline_mean, baseline_std, threshold, severity, status, created_at) FROM stdin;
4	Z001	2025-01-03	65	13	0.816496580927726	14.632993161855453	\N	ACTIVE	2026-01-04 00:12:53.470736
\.


--
-- Data for Name: baselines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.baselines (id, zone_id, mean, std, calculated_on) FROM stdin;
26	Z002	13.666666666666666	11.556623882239812	2026-01-03
27	Z003	21	0.816496580927726	2026-01-03
28	Z001	13	0.816496580927726	2026-01-03
\.


--
-- Data for Name: raw_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.raw_reports (id, date, zone_id, latitude, longitude, symptom_type, observed) FROM stdin;
94	2025-01-01	Z001	4.0511	9.7679	\N	12
95	2025-01-02	Z001	4.0511	9.7679	\N	14
97	2025-01-01	Z002	3.848	11.5021	\N	5
98	2025-01-02	Z002	3.848	11.5021	\N	6
99	2025-01-03	Z002	3.848	11.5021	\N	30
100	2025-01-01	Z003	5.9631	10.1591	\N	20
101	2025-01-02	Z003	5.9631	10.1591	\N	22
102	2025-01-03	Z003	5.9631	10.1591	\N	21
96	2025-01-03	Z001	4.0511	9.7679	\N	65
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role, created_at) FROM stdin;
1	Daniel	daniel@oewm.com	$2b$10$oVVotEvgJeXWpnxtAb1GVesBmfIBYrG1EOFtbhyX.JythpU5uGfE6	analyst	2026-01-02 11:53:52.909863
2	Daniel	daniel@test.com	$2b$10$Ew.y.dDZmBxNQJbCJGwuTOhZjEK3CvcclplrIA2zfRGZJ4cxdOhG.	analyst	2026-01-02 20:17:19.639311
3	Gibson	gibgichuki@gmail.com	$2b$10$Rl85ZJ1VTWIEBvp.41xRxeZKaYykuQ5i13SSrb6TylgxPIokCSvyy	analyst	2026-01-02 21:10:20.495004
4	Ebenezer	akploebenezerselorm@gmail.com	$2b$10$/PpoJ.2MORMXU/lxP7edm.bDTjgbgG5LF9ub3R/wmgNgAbu48WYUq	analyst	2026-01-02 21:26:47.796119
5	ggggg	daniel12@test.com	$2b$10$SJ0CHcpUHZdarBuHZ/xz1uVoLjRFlZIQrrDO2Z.AlB1HUxDNufKLO	analyst	2026-01-02 23:45:42.789286
\.


--
-- Name: alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alerts_id_seq', 4, true);


--
-- Name: baselines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.baselines_id_seq', 34, true);


--
-- Name: raw_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.raw_reports_id_seq', 102, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- Name: baselines baselines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baselines
    ADD CONSTRAINT baselines_pkey PRIMARY KEY (id);


--
-- Name: raw_reports raw_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raw_reports
    ADD CONSTRAINT raw_reports_pkey PRIMARY KEY (id);


--
-- Name: baselines unique_zone_baseline; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baselines
    ADD CONSTRAINT unique_zone_baseline UNIQUE (zone_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict 9QMQuxs2oGvRqpzhDDV6JEeoG0LaKhlzNsdUjyhpdldiyK5SsFkWciO6PK1UUgj

