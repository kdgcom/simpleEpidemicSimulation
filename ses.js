/*****
 *
 * ses.js
 *
 * Simple Epidemic 2D Simulation code
 *
 */

/**
 * simulation time : 1 = 1 second
 * simulation dimention : pixel base
 */

class Vector2
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
}

/**
 * 파티클 클래스
 *
 * 파티클들의위치와 속도를 가지고 있다.
 * move함수를 실행하게 되면 다음 시간대에 파티클의 위치를 구해 주게 된다.
 * 이때 move는 다음 위치를 임시 저장소에 저장하게 되며, 
 * ParticleManager에서 이동시 다른 입자와 충돌 여부를 판단해
 * 충돌하게 되면 newVelocity함수를 이용해 이동 방향을 바꾸게 된다.
 */
class Particle
{
	constructor(size, x, y)
	{
		var vel = newVelocity();
		this.constructor(size, x, y, vel.x, vel.y);
	}

	/**
	 * Particle의 주 constructor
	 *
	 * @param		id			id of particle
	 * @param		size		size of particle or impact parameter of particle
	 * @param		x			x coordinate
	 * @param		y			y coordinate
	 * @param		vx			Velocity x
	 * @param		vy			Velocity y
	 * @param		moveFactor	사회적 거리 유지를 위해 움직이는 양을 조절
	 */
	constructor(id, size, x, y, vx, vy, moveFactor)
	{
		this.id = id;
		this.size = size;
		this.pos = new Vector2(x, y);
		this.vel = new Vector2(vx, vy);
		this.mesh = new Vector2(0, 0);
	}

	/**
	 * 이 입자가 몇번째 mesh에 들어가 있는지를 저장
	 */
	setMesh(idxX, idxY)
	{
		this.mesh.x = idxX;
		this.mesh.y = idxY;
	}

	newVelocity()
	{
		var vel = new Vector2(0, 0);
		var t = Math.random()*360*0.01745;
		var v = Math.random()*size*2;	// 1초에 size의 2배 만큼씩 움직임.
		vel.x = v * Math.cos(t);
		vel.y = v * Math.sin(t);

		return vel;
	}

	/**
	 * 일단 임시 공간으로 move시킨다.
	 *
	 * @param		dt		delta time
	 */
	tempMove( dt )
	{
		if ( this.nextPos==null )
			this.nextPos = new Vector2(0, 0);
		this.nextPos.x = this.pos.x + dt * this.vel.x;
		this.nextPos.y = this.pos.y + dt * this.vel.y;
	}

	move()
	{
		this.pos.x = this.nextPos.x;
		this.pos.y = this.nextPos.y;
	}
}

/**
 * ParticleMeshManager는 particle들을 관리하는 매니저다.
 * 일단 particle들의 리스트를 몰아 두고 있으며, 시간에 따라 파티클들의 위치를 업데이트한다.
 * time step이 진행됨에 따라 입자들을 이동시키되, 
 * 이동 구간에 다른 입자와 충돌하면 움직임을 변화시킨다.
 */
class ParticleMeshManager
{
	/**
	 * @param	spaceSizeX			실제 시뮬레이션 공간의 X사이즈
	 * @param	spaceSizeY			실제 시뮬레이션 공간의 Y사이즈
	 * @param	meshNX				x축 메쉬 사이즈
	 * @param	meshNY				Y축 메쉬 사이즈
	 */
	constructor( spaceSizeX, spaceSizeY, meshNX, meshNY)
	{
		// 모든 입자들을 쌓아둘 dictionary
		this.particles = {};
		// 메쉬마다 입자들을 관리할 2차원 배열 초기화
		this.mesh = [];
		for(i=0; i<meshNX; ++i)
		{
			this.mesh[i] = [];
			for(j=0; j<meshNY; ++j)
				this.mesh[i][j] = {};  // javascript에서의 {}는 dictionary로 사용할 수 있음.
		}
	}

	/**
	 * Add a particle
	 */
	add( p )
	{
		this.particles[p.id] = p;
	}

	update( dt )
	{
		var ps = this.particles;
		// 일단 존재하는 모든 particles를 임시로 move시킨다.
		for(i=0; i<ps.length; ++i)
			ps[i].move(dt);
		// 충돌을 체크하여 충돌시 새로운 속도를 가지고 다른 방향으로 진행시키며
		// 새로운 위치로 실제 입자를 이동시킨다.
	}
}

