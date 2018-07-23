import React, { Component } from "react";
import moment from "moment";
import axios from "axios";
import * as d3 from "d3";
import "./index.scss";

const message = msg => {
    window.alert(msg);
};

const query = ({ start, end }) => {
    return axios
        .get("votes", {
            params: {
                start,
                end
            }
        })
        .then(res => {
            const { data = {} } = res;
            if (data.rtn !== 0) {
                throw new Error(`code: ${data.rtn}, message: ${data.message}`);
            }
            return data;
        })
        .catch(err => {
            console.error(err);
            message(err);
        });
};

const PULSE_INTERVAL = 60 * 5 * 1000;

class Votes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            start: moment()
                .subtract(1, "days")
                .unix(),
            end: moment().unix(),
            isLoading: false,
            data: []
        };
    }

    _timer = null;
    _ref = null;

    componentDidMount() {
        this.pulse();
    }

    componentWillUnmount() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    getRef = ref => {
        this._ref = ref;
    };

    pulse = () => {
        this.fetch().then(() => {
            this._timer = setTimeout(this.pulse, PULSE_INTERVAL);
            this.draw();
        });
    };

    draw = () => {
        const { data } = this.state;
        const svg = d3.select(this._ref),
            margin = { top: 20, right: 80, bottom: 30, left: 100 },
            width = svg.attr("width") - margin.left - margin.right,
            height = svg.attr("height") - margin.top - margin.bottom,
            g = svg
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        const x = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            z = d3.scaleOrdinal(d3.schemeCategory10);

        const parseTime = d3.timeParse("%s");
        const line = d3
            .line()
            .x(d => x(d.x))
            .y(d => y(d.y));
        const candidateMap = {};
        const circles = [];
        let minY = Number.MAX_VALUE,
            maxY = 0,
            minX = data[0] ? parseTime(data[0].timestamp) : 0,
            maxX = data[data.length - 1] ? parseTime(data[data.length - 1].timestamp) : 0;

        data.map(({ timestamp, ...candidates }) => {
            for (let key in candidates) {
                let arr = candidateMap[key] || [];
                arr.push({
                    x: parseTime(timestamp),
                    y: candidates[key]
                });
                circles.push({
                    x: parseTime(timestamp),
                    y: candidates[key],
                    id: key
                });
                candidateMap[key] = arr;
                minY = Math.min(minY, candidates[key]);
                maxY = Math.max(maxY, candidates[key]);
            }
        });

        const candidates = Object.keys(candidateMap);
        x.domain([minX, maxX]);
        y.domain([minY, maxY]);
        z.domain(candidates);

        g.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));
        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .text("vote count");

        let candidatePath = g
            .selectAll(".candidate")
            .data(Object.values(candidateMap))
            .enter()
            .append("g")
            .attr("class", "candidate");

        candidatePath
            .append("path")
            .attr("class", "line")
            .attr("d", d => line(d))
            .style("stroke", (d, index) => z(candidates[index]));

        candidatePath
            .append("text")
            .datum((d, index) => {
                let name = candidates[index];
                let arr = candidateMap[name];
                return { id: name, value: arr[arr.length - 1] };
            })
            .attr("transform", d => `translate(${x(d.value.x)}, ${y(d.value.y)})`)
            .attr("x", 5)
            .attr("dy", "0.35em")
            .style("font", "15px sans-serif")
            .text(function(d) {
                return d.id;
            });

        g.selectAll(".circle")
            .data(circles)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 3)
            .style("fill", d => z(d.id));
    };

    fetch = () => {
        const { start, end } = this.state;
        this.setState({
            isLoading: true
        });

        return query({ start, end })
            .then(res => {
                if (res.rtn === 0) {
                    this.setState({
                        data: res.data
                    });
                }
            })
            .finally(() => {
                this.setState({
                    isLoading: false
                });
            });
    };

    render() {
        return (
            <div className="votes">
                <svg ref={this.getRef} width={1500} height={700} />
            </div>
        );
    }
}

export default Votes;
